// Css
import TableStyles from './TableStyles.module.css';
// Icons
import Icon from '../Icons/Icons';
// Libs
import React from 'react';

interface GenericEntityRowProps<T extends { id: string | number }> {
    item: T;
    columns: {
        key: string;
        label?: string;
        onClick?: (item: T) => void;
        render?: (item: T) => React.ReactNode;
    }[];
    columnTemplate: string;
    onEdit?: (item: T) => void;
    onDelete?: (id: string | number) => void | Promise<void>;
}

export default function GenericEntityRow<T extends { id: string | number }>({
    item,
    columns,
    onEdit,
    onDelete,
    columnTemplate,
}: GenericEntityRowProps<T>) {
    return (
        <div
            className={TableStyles.tableRow}
            style={{ gridTemplateColumns: columnTemplate }}
        >

            {columns.map((col, idx) => (
                <div key={idx} data-label={col.label} onClick={() => col.onClick?.(item)}>
                    {col.render?.(item) ?? null}
                </div>
            ))}

            <div className={TableStyles.actionCell}>
                {onEdit && (
                    <button className={TableStyles.actionButtonEdit} onClick={() => onEdit(item)}>
                        <Icon nome="arrow" />
                    </button>
                )}
                {onDelete && (
                    <button className={TableStyles.actionButtonDelete} onClick={() => onDelete(item.id)}>
                        <Icon nome="close" />
                    </button>
                )}
            </div>
        </div>
    );
}