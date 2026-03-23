import { useRef, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';
import LoanStatusBadge from './LoanStatusBadge';
import styles from './LoanDetails.module.css';

const LOAN_TYPE_LABELS = {
  CASH: 'Keš kredit',
  AUTO: 'Auto kredit',
  MORTGAGE: 'Stambeni kredit',
};

export default function LoanDetails({ loan }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!loan) return;
    const ctx = gsap.context(() => {
      gsap.from('.ld-anim', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.07,
        ease: 'power2.out',
      });
    }, ref);
    return () => ctx.revert();
  }, [loan?.id]);

  const formatCurrency = (amount, currency) =>
    amount != null
      ? new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2 }).format(amount) + (currency ? ` ${currency}` : '')
      : '—';

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const installments = loan?.installments ?? loan?.repayment_schedule ?? [];

  // Find next unpaid installment
  const nextInstallment = useMemo(() => {
    return installments.find(inst => {
      const s = (inst.status ?? '').toUpperCase();
      return s !== 'PAID' && s !== 'PLAĆENO' && s !== 'COMPLETED';
    });
  }, [installments]);

  // Remaining debt = sum of unpaid installments or from backend
  const remainingDebt = useMemo(() => {
    if (loan?.remaining_debt != null) return loan.remaining_debt;
    if (loan?.outstanding_balance != null) return loan.outstanding_balance;
    return installments
      .filter(inst => {
        const s = (inst.status ?? '').toUpperCase();
        return s !== 'PAID' && s !== 'PLAĆENO' && s !== 'COMPLETED';
      })
      .reduce((sum, inst) => sum + (inst.amount ?? 0), 0);
  }, [loan, installments]);

  if (!loan) return null;

  const typeName = LOAN_TYPE_LABELS[loan.loan_type] ?? loan.loan_type ?? loan.name ?? `Kredit #${loan.id}`;
  const loanName = loan.currency ? `${typeName} u ${loan.currency}` : typeName;

  const nks = loan.nominal_interest_rate ?? loan.nks ?? loan.interest_rate;
  const eks = loan.effective_interest_rate ?? loan.eks;
  const nextDueDate = nextInstallment?.due_date ?? nextInstallment?.date ?? loan.next_due_date;

  return (
    <div ref={ref} className={styles.detailsContainer}>
      <header className={`ld-anim ${styles.header}`}>
        <h2>{loanName}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={styles.loanId}>Partija: {loan.contract_number ?? loan.id}</span>
          <LoanStatusBadge status={loan.status} />
        </div>
      </header>

      {/* Finansijski podaci */}
      <div className={`ld-anim ${styles.financialGrid}`}>
        <div className={styles.card}>
          <span>Iznos kredita</span>
          <strong>{formatCurrency(loan.amount, loan.currency)}</strong>
        </div>
        <div className={styles.card}>
          <span>Mesečna rata</span>
          <strong>{formatCurrency(loan.monthly_installment, loan.currency)}</strong>
        </div>
        <div className={styles.card}>
          <span>Period otplate</span>
          <strong>{loan.repayment_period ?? '—'} mes.</strong>
        </div>
        {nks != null && (
          <div className={styles.card}>
            <span>NKS (Nominalna)</span>
            <strong>{Number(nks).toFixed(2)}%</strong>
          </div>
        )}
        {eks != null && (
          <div className={styles.card}>
            <span>EKS (Efektivna)</span>
            <strong>{Number(eks).toFixed(2)}%</strong>
          </div>
        )}
        <div className={styles.card}>
          <span>Preostalo dugovanje</span>
          <strong className={styles.debt}>{formatCurrency(remainingDebt, loan.currency)}</strong>
        </div>
        {nextDueDate && (
          <div className={styles.card}>
            <span>Datum dospeća</span>
            <strong>{formatDate(nextDueDate)}</strong>
          </div>
        )}
      </div>

      {/* Nadolazeća obaveza — istaknuta sledeća rata */}
      {nextInstallment && (
        <section className={`ld-anim ${styles.nextInstallment}`}>
          <h3>Naredna rata</h3>
          <div className={styles.nextDueBox}>
            <div>
              <p>Rata br.</p>
              <strong>{nextInstallment.number ?? '—'}</strong>
            </div>
            <div>
              <p>Iznos</p>
              <strong>{formatCurrency(nextInstallment.amount, loan.currency)}</strong>
            </div>
            <div>
              <p>Datum dospeća</p>
              <strong>{formatDate(nextInstallment.due_date ?? nextInstallment.date)}</strong>
            </div>
          </div>
        </section>
      )}

      {/* Anuitetni plan — tabelarna istorija */}
      {installments.length > 0 && (
        <section className={`ld-anim ${styles.plan}`}>
          <h3>Plan otplate</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Datum dospeća</th>
                <th>Iznos rate</th>
                <th>Glavnica</th>
                <th>Kamata</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {installments.map((inst, i) => {
                const isNext = nextInstallment && (inst.number ?? i + 1) === (nextInstallment.number ?? -1);
                return (
                  <tr key={inst.number ?? i} style={isNext ? { background: 'var(--blue-dim, #EBF0FF)', fontWeight: 600 } : undefined}>
                    <td>{inst.number ?? i + 1}</td>
                    <td>{formatDate(inst.due_date ?? inst.date)}</td>
                    <td>{formatCurrency(inst.amount)}</td>
                    <td>{inst.principal != null ? formatCurrency(inst.principal) : '—'}</td>
                    <td>{inst.interest != null ? formatCurrency(inst.interest) : '—'}</td>
                    <td><LoanStatusBadge status={inst.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
