import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import LoanStatusBadge from './LoanStatusBadge';
import styles           from './LoanRequestsTable.module.css';

export default function LoanRequestsTable({ requests, onApprove, onReject, actionId }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lrt-row', {
        opacity: 0,
        y: 16,
        duration: 0.35,
        stagger: 0.06,
        ease: 'power2.out',
      });
    }, ref);
    return () => ctx.revert();
  }, [requests.length]);

  if (requests.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--tx-3)" strokeWidth="1.5" width="32" height="32">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <p>Nema aktivnih kreditnih zahteva.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.tableCard}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Klijent</th>
              <th>Iznos</th>
              <th>Period</th>
              <th>Tip kredita</th>
              <th>Mesečna rata</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => {
              const isPending = req.status === 'PENDING' || req.status === 'NA ČEKANJU';
              return (
                <tr key={req.id} className="lrt-row">
                  <td className={styles.clientName}>{req._clientName ?? `Klijent #${req.client_id}`}</td>
                  <td className={styles.mono}>
                    {Number(req.amount).toLocaleString('sr-RS', { minimumFractionDigits: 2 })}{' '}
                    {req.currency ?? ''}
                  </td>
                  <td>{req.repayment_period ?? req.duration_months} mes.</td>
                  <td>{req.loan_type ?? ''}</td>
                  <td className={styles.mono}>
                    {req.monthly_installment
                      ? Number(req.monthly_installment).toLocaleString('sr-RS', { minimumFractionDigits: 2 })
                      : '—'}
                  </td>
                  <td>
                    <LoanStatusBadge status={req.status} />
                  </td>
                  <td>
                    {isPending && (
                      <div className={styles.actionBtns}>
                        <button
                          className={styles.btnApprove}
                          onClick={() => onApprove(req.id)}
                          disabled={actionId === req.id}
                          title="Odobri kreditni zahtev"
                        >
                          {actionId === req.id ? '...' : 'Odobri'}
                        </button>
                        <button
                          className={styles.btnReject}
                          onClick={() => onReject(req.id)}
                          disabled={actionId === req.id}
                          title="Odbij kreditni zahtev"
                        >
                          {actionId === req.id ? '...' : 'Odbij'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
