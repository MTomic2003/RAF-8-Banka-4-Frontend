import styles from './PaymentTable.module.css';

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
}

const STATUS_LABELS = {
  'completed': 'Realizovano',
  'COMPLETED': 'Realizovano',
  'processing': 'U obradi',
  'pending': 'U obradi',
  'PENDING': 'U obradi',
  'failed': 'Odbijeno',
  'rejected': 'Odbijeno',
  'FAILED': 'Odbijeno',
  'REJECTED': 'Odbijeno',
};

export default function PaymentTable({ transactions, onRowClick }) {
  if (!transactions?.length) {
    return <div className={styles.empty}>Nema transakcija za prikaz.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Datum i vreme</th>
            <th>Primalac / Svrha</th>
            <th style={{ textAlign: 'right' }}>Iznos</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => {
            const date = t.created_at ?? t.execution_timestamp ?? t.date;
            const recipient = t.recipient_name ?? t.recipient ?? t.purpose ?? '—';
            const status = t.status ?? '—';
            return (
            <tr
              key={t.id ?? t.payment_id}
              className={styles.tableRow}
              onClick={() => onRowClick(t)}
            >
              <td>{formatDateTime(date)}</td>
              <td>
                <div className={styles.name}>{recipient}</div>
                <div className={styles.type}>
                  {t.type === 'exchange' ? '🔄 Menjačnica' : '💸 Plaćanje'}
                </div>
              </td>

              <td style={{ textAlign: 'right' }} className={styles.amountNegative}>
                {Number(t.amount ?? 0).toLocaleString('sr-RS', { minimumFractionDigits: 2 })} {t.currency}
              </td>

              <td style={{ textAlign: 'center' }}>
                <span className={`${styles.badge} ${styles['badge' + status.replace(/\s+/g, '')]}`}>
                  {STATUS_LABELS[status] ?? status}
                </span>
              </td>

              <td style={{ color: '#ccc', textAlign: 'right', paddingRight: '15px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}