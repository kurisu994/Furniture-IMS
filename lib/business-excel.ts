/** 业务 Excel 列定义 */
export interface ExcelColumn {
  key: string
  header: string
  type?: 'text' | 'number'
}

/** 物料模板列 */
export const materialExcelColumns: ExcelColumn[] = [
  { key: 'code', header: '物料编码', type: 'text' },
  { key: 'name', header: '物料名称', type: 'text' },
  { key: 'material_type', header: '物料类型', type: 'text' },
  { key: 'category_code', header: '分类编码', type: 'text' },
  { key: 'category_name', header: '分类名称', type: 'text' },
  { key: 'spec', header: '规格型号', type: 'text' },
  { key: 'base_unit_name', header: '基础单位', type: 'text' },
  { key: 'aux_unit_name', header: '辅助单位', type: 'text' },
  { key: 'conversion_rate', header: '换算比例', type: 'number' },
  { key: 'ref_cost_price', header: '参考进价', type: 'number' },
  { key: 'sale_price', header: '销售价格', type: 'number' },
  { key: 'safety_stock', header: '安全库存', type: 'number' },
  { key: 'max_stock', header: '最高库存', type: 'number' },
  { key: 'lot_tracking_mode', header: '批次追踪', type: 'text' },
  { key: 'texture', header: '材质', type: 'text' },
  { key: 'color', header: '颜色', type: 'text' },
  { key: 'surface_craft', header: '表面工艺', type: 'text' },
  { key: 'length_mm', header: '长(mm)', type: 'number' },
  { key: 'width_mm', header: '宽(mm)', type: 'number' },
  { key: 'height_mm', header: '高(mm)', type: 'number' },
  { key: 'barcode', header: '条形码', type: 'text' },
  { key: 'remark', header: '备注', type: 'text' },
]

/** 期初库存模板列 */
export const initialInventoryExcelColumns: ExcelColumn[] = [
  { key: 'material_code', header: '物料编码', type: 'text' },
  { key: 'warehouse_code', header: '仓库编码', type: 'text' },
  { key: 'quantity', header: '数量', type: 'number' },
  { key: 'unit_cost_usd', header: '单位成本USD分', type: 'number' },
  { key: 'received_date', header: '入库日期', type: 'text' },
  { key: 'lot_no', header: '批次号', type: 'text' },
  { key: 'supplier_batch_no', header: '供应商批号', type: 'text' },
  { key: 'remark', header: '备注', type: 'text' },
]

/** 将单元格值转为字符串 */
function toCellText(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text ? text : null
}

/** 将单元格值转为数字 */
function toCellNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

/** 读取 Excel 文件并按列定义映射为业务行 */
export async function readBusinessExcelRows<T extends object>(file: File, columns: ExcelColumn[]): Promise<T[]> {
  const XLSX = await import('xlsx')
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) return []

  const worksheet = workbook.Sheets[firstSheetName]
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' })
  return rawRows.map(raw => {
    const mapped: Record<string, unknown> = {}
    for (const column of columns) {
      const value = raw[column.header] ?? raw[column.key] ?? ''
      mapped[column.key] = column.type === 'number' ? toCellNumber(value) : toCellText(value)
    }
    return mapped as T
  })
}

/** 下载业务 Excel 文件 */
export async function downloadBusinessWorkbook<T extends object>(fileName: string, sheetName: string, columns: ExcelColumn[], rows: T[]) {
  const XLSX = await import('xlsx')
  const sheetRows = rows.map(row => {
    const sheetRow: Record<string, unknown> = {}
    const record = row as Record<string, unknown>
    for (const column of columns) {
      sheetRow[column.header] = record[column.key]
    }
    return sheetRow
  })
  const worksheet = XLSX.utils.json_to_sheet(sheetRows.length ? sheetRows : [Object.fromEntries(columns.map(column => [column.header, '']))])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, fileName)
}
