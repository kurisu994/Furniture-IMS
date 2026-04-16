'use client'

import { ChevronDown, ChevronRight, Folder, FolderOpen, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type NodeApi, type NodeRendererProps, Tree } from 'react-arborist'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { CategoryNode, CategorySortItem } from '@/lib/tauri'
import { deleteCategory, getCategoryTree, updateCategoryOrder } from '@/lib/tauri'

/* ------------------------------------------------------------------ */
/*  树节点数据类型（react-arborist 需要嵌套 children 结构）             */
/* ------------------------------------------------------------------ */

export interface TreeNode {
  id: string
  name: string
  rawData: CategoryNode
  children?: TreeNode[]
}

/* ------------------------------------------------------------------ */
/*  工具函数：扁平列表 → 嵌套树                                       */
/* ------------------------------------------------------------------ */

/** 将后端返回的扁平分类列表转换为嵌套的树形结构 */
function buildTree(flatNodes: CategoryNode[]): TreeNode[] {
  const map = new Map<number, TreeNode>()
  const roots: TreeNode[] = []

  // 第一遍：创建所有节点映射
  for (const node of flatNodes) {
    map.set(node.id, {
      id: node.id.toString(),
      name: node.name,
      rawData: node,
      children: [],
    })
  }

  // 第二遍：建立父子关系
  for (const node of flatNodes) {
    const treeNode = map.get(node.id)!
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children!.push(treeNode)
    } else {
      roots.push(treeNode)
    }
  }

  // 清理：没有子节点时删除空 children 数组
  for (const node of map.values()) {
    if (node.children && node.children.length === 0) {
      delete node.children
    }
  }

  return roots
}

/** 将树形结构扁平化为排序项列表 */
function flattenTreeForOrder(nodes: TreeNode[], parentId: number | null = null): CategorySortItem[] {
  const result: CategorySortItem[] = []
  nodes.forEach((node, index) => {
    result.push({
      id: parseInt(node.id),
      parent_id: parentId,
      sort_order: index,
    })
    if (node.children) {
      result.push(...flattenTreeForOrder(node.children, parseInt(node.id)))
    }
  })
  return result
}

/* ------------------------------------------------------------------ */
/*  单个树节点渲染器                                                   */
/* ------------------------------------------------------------------ */

function TreeNodeRenderer({
  node,
  style,
  dragHandle,
  onEdit,
  onDelete,
}: NodeRendererProps<TreeNode> & {
  onEdit: (node: NodeApi<TreeNode>) => void
  onDelete: (node: NodeApi<TreeNode>) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors ${
        node.isSelected ? 'bg-primary/10 text-primary' : hovered ? 'bg-muted/60' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => node.toggle()}
    >
      {/* 拖拽手柄 */}
      <GripVertical className="text-muted-foreground/40 size-3.5 shrink-0 cursor-grab active:cursor-grabbing" />

      {/* 展开/折叠图标 */}
      <span className="flex size-5 shrink-0 items-center justify-center">
        {node.isInternal ? (
          node.isOpen ? (
            <ChevronDown className="text-muted-foreground size-4" />
          ) : (
            <ChevronRight className="text-muted-foreground size-4" />
          )
        ) : (
          <span className="size-4" />
        )}
      </span>

      {/* 文件夹图标 */}
      {node.isInternal && node.isOpen ? (
        <FolderOpen className="text-primary size-4 shrink-0" />
      ) : (
        <Folder className="text-primary/70 size-4 shrink-0" />
      )}

      {/* 名称 */}
      <span className="ml-1 flex-1 truncate text-sm font-medium">{node.data.name}</span>

      {/* 操作按钮 — hover 时显示 */}
      {hovered && (
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-6"
            onClick={e => {
              e.stopPropagation()
              onEdit(node)
            }}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive size-6"
            onClick={e => {
              e.stopPropagation()
              onDelete(node)
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  主组件                                                             */
/* ------------------------------------------------------------------ */

interface CategoryTreeProps {
  /** 当点击「编辑」时触发 */
  onEdit: (category: CategoryNode | null) => void
  /** 外部触发刷新的计数器 */
  refreshKey: number
}

export function CategoryTree({ onEdit, refreshKey }: CategoryTreeProps) {
  const t = useTranslations('categories')
  const tc = useTranslations('common')
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(true)

  /** 加载分类数据 */
  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const nodes = await getCategoryTree()
      setTreeData(buildTree(nodes))
    } catch (e) {
      toast.error(typeof e === 'string' ? e : tc('loading'))
    } finally {
      setLoading(false)
    }
  }, [tc])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories, refreshKey])

  /** 处理拖拽排序完成 */
  const handleMove = useCallback(
    async ({ dragIds, parentId, index }: { dragIds: string[]; parentId: string | null; index: number }) => {
      // react-arborist 会自动更新内部 tree state，
      // 我们需要在变更后将整棵树状态持久化到后端
      // 等待 setState 更新后读取最新树状态
      setTimeout(async () => {
        // 从当前树 ref 获取最新的数据
        // 由于 react-arborist 在 uncontrolled 模式下自己管理数据,
        // 我们需要通过其内部 API 来获取最新的树结构
        // 简化方案：基于拖拽事件重建排序列表
        try {
          // 重新取一次后端数据来确保同步（优化方案可以后续改进）
          const currentNodes = await getCategoryTree()
          const mutableNodes = [...currentNodes]

          // 更新拖拽节点的 parent_id 和 sort_order
          for (const dragId of dragIds) {
            const nodeIdx = mutableNodes.findIndex(n => n.id === parseInt(dragId))
            if (nodeIdx >= 0) {
              mutableNodes[nodeIdx] = {
                ...mutableNodes[nodeIdx],
                parent_id: parentId ? parseInt(parentId) : null,
              }
            }
          }

          // 重建树并提取排序
          const newTree = buildTree(mutableNodes)
          const sortItems = flattenTreeForOrder(newTree)
          await updateCategoryOrder(sortItems)
          await fetchCategories()
        } catch (e) {
          toast.error(typeof e === 'string' ? e : '排序更新失败')
        }
      }, 100)
    },
    [fetchCategories],
  )

  /** 处理删除 */
  const handleDelete = useCallback(
    async (node: NodeApi<TreeNode>) => {
      const category = node.data.rawData

      if (!window.confirm(t('deleteConfirm', { name: category.name }))) {
        return
      }

      try {
        await deleteCategory(category.id)
        toast.success(t('deleteSuccess'))
        fetchCategories()
      } catch (e) {
        toast.error(typeof e === 'string' ? e : t('hasMaterials'))
      }
    },
    [t, fetchCategories],
  )

  /** 处理编辑 */
  const handleEdit = useCallback(
    (node: NodeApi<TreeNode>) => {
      onEdit(node.data.rawData)
    },
    [onEdit],
  )

  /** 为 react-arborist 的 Node 组件传入额外参数的包裹器 */
  const NodeWrapper = useMemo(() => {
    return function WrappedNode(props: NodeRendererProps<TreeNode>) {
      return <TreeNodeRenderer {...props} onEdit={handleEdit} onDelete={handleDelete} />
    }
  }, [handleEdit, handleDelete])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground animate-pulse text-sm">{tc('loading')}</div>
      </div>
    )
  }

  if (treeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Folder className="text-muted-foreground/40 size-12" />
        <p className="text-muted-foreground text-sm">{t('emptyState')}</p>
        <p className="text-muted-foreground/60 text-xs">{t('emptyStateDesc')}</p>
      </div>
    )
  }

  return (
    <div className="category-tree min-h-[300px]">
      <Tree<TreeNode>
        initialData={treeData}
        openByDefault={true}
        width="100%"
        height={600}
        indent={24}
        rowHeight={36}
        onMove={handleMove}
        disableMultiSelection
      >
        {NodeWrapper}
      </Tree>
    </div>
  )
}
