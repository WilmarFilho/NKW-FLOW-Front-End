import './genericTable.css'

interface GenericTableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode; 
}

function GenericTable<T>({ columns, data, renderRow }: GenericTableProps<T>) {
  return (
    <div >
      <div className="table-header">
        {columns.map((col, i) => (
          <div key={i}>{col}</div>
        ))}
      </div>
      {data.map((item, index) => renderRow(item, index))}
    </div>
  );
}

export default GenericTable;





