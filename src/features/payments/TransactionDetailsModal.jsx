import styles from './TransactionDetailsModal.module.css';

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

export default function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.header}><h2>Detalji transakcije</h2></div>

        <div className={styles.body}>
          {/* Račun platioca i Račun primaoca */}
          <div className={styles.infoRow}><span>Račun platioca:</span><strong>{transaction.payer_account_number ?? transaction.sender_account ?? '—'}</strong></div>
          <div className={styles.infoRow}><span>Račun primaoca:</span><strong>{transaction.recipient_account_number ?? transaction.recipient_account ?? '—'}</strong></div>

          <hr className={styles.divider} />

          <div className={styles.infoRow}><span>Šifra plaćanja:</span><strong>{transaction.payment_code ?? transaction.paymentCode ?? '—'}</strong></div>
          <div className={styles.infoRow}><span>Poziv na broj:</span><strong>{transaction.reference_number ?? transaction.reference ?? '—'}</strong></div>

          <hr className={styles.divider} />

          <div className={styles.infoRow}>
            <span>Iznos:</span>
            <strong>{Number(transaction.amount ?? 0).toLocaleString('sr-RS', { minimumFractionDigits: 2 })} {transaction.currency ?? ''}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Provizija:</span>
            <strong>{Number(transaction.fee ?? 0).toLocaleString('sr-RS', { minimumFractionDigits: 2 })} {transaction.currency ?? ''}</strong>
          </div>

          <hr className={styles.divider} />

          <div className={styles.infoRow}><span>Vreme izvršenja:</span><strong>{formatDateTime(transaction.created_at ?? transaction.execution_timestamp)}</strong></div>

          <div className={styles.infoRow}>
            <span>Status:</span>
            <span className={`${styles.badge} ${styles['badge' + (transaction.status ?? '').replace(/\s+/g, '')]}`}>{STATUS_LABELS[transaction.status] ?? transaction.status ?? '—'}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnSecondary} onClick={onClose}>Zatvori</button>
          <button className={styles.btnPrimary} onClick={() => window.print()}>Preuzmi potvrdu</button>
        </div>
      </div>
    </div>
  );
}