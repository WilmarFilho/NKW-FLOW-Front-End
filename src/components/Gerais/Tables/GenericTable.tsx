import React from 'react';
import { motion } from 'framer-motion';
// CSS Modules
import styles from './GenericTable.module.css';


interface GenericTableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  gridTemplateColumns: string;
}

export default function GenericTable<T>({
  columns,
  data,
  renderRow,
  gridTemplateColumns,
}: GenericTableProps<T>) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={styles.tableContainer}
    >

      <header
        className={styles.tableHeader}
        style={{ gridTemplateColumns }}
      >
        {columns.map((col, i) => (
          <div key={i}>{col}</div>
        ))}
      </header>
      <div className={styles.tableBody}>
        {data.map((item, index) => renderRow(item, index))}
      </div>

    </motion.section>
  );
}