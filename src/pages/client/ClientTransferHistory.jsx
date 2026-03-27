import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { transfersApi } from '../../api/endpoints/transfers';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/ui/Spinner';
import styles from './ClientTransferHistory.module.css';

function formatAmount(amount, currency = '') {
  const formatted = new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount ?? 0));
  return currency ? `${formatted} ${currency}` : formatted;
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })
  );
}

function shortAccount(num) {
  if (!num) return '—';
  return `••••${String(num).slice(-4)}`;
}

export default function ClientTransferHistory() {
  const navigate = useNavigate();
  const user     = useAuthStore(s => s.user);
  const logout   = useAuthStore(s => s.logout);
  const clientId = useAuthStore(s => s.user?.client_id ?? s.user?.id);

  const [page, setPage]                           = useState(1);
  const [showTransfersMenu, setShowTransfersMenu] = useState(false);
  const [showPaymentsMenu,  setShowPaymentsMenu]  = useState(false);
  const PAGE_SIZE = 20;

  const { data, loading, error } = useFetch(
    () => transfersApi.getHistory(clientId, { page, page_size: PAGE_SIZE }),
    [clientId, page]
  );

  // API vraća { data: [...], total, page, total_pages }
  const rawTransfers = data?.data ?? (Array.isArray(data) ? data : []);
  const totalPages   = data?.total_pages ?? 0;

  // Sortiraj od najnovijeg ka najstarijem po created_at
  const transfers = [...rawTransfers].sort((a, b) =>
    new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0)
  );

  function handleLogout() { logout(); navigate('/login'); }

  const transfersSubItems = [
    { label: 'Novi transfer',      path: '/transfers/new' },
    { label: 'Istorija transfera', path: '/transfers/history' },
  ];
  const paymentsSubItems = [
    { label: 'Novo plaćanje',     path: '/client/payments/new' },
    { label: 'Prenos',            path: '/transfers/new' },
    { label: 'Primaoci plaćanja', path: '/client/recipients' },
    { label: 'Pregled plaćanja',  path: '/client/payments' },
  ];

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <button
          className={styles.headerBrand}
          onClick={() => navigate('/dashboard')}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className={styles.headerBrandText}>RAFBank</span>
        </button>

        <nav className={styles.headerNav}>
          <button className={styles.headerNavBtn} onClick={() => navigate('/client/accounts')}>Računi</button>

          <div className={styles.payDropdownWrap}>
            <button
              className={`${styles.headerNavBtn} ${styles.headerNavBtnActive}`}
              onClick={() => setShowTransfersMenu(p => !p)}
            >
              Transferi
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showTransfersMenu && (
              <div className={styles.payDropdownMenu}>
                {transfersSubItems.map(item => (
                  <button
                    key={item.label}
                    className={`${styles.payDropdownItem} ${item.path === '/transfers/history' ? styles.payDropdownItemActive : ''}`}
                    onClick={() => { navigate(item.path); setShowTransfersMenu(false); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className={styles.headerNavBtn} onClick={() => navigate('/client/exchange')}>Menjačnica</button>
          <button className={styles.headerNavBtn} onClick={() => navigate('/client/cards')}>Kartice</button>
          <button className={styles.headerNavBtn} onClick={() => navigate('/client/loans')}>Krediti</button>

          <div className={styles.payDropdownWrap}>
            <button
              className={`${styles.headerNavBtn} ${showPaymentsMenu ? styles.headerNavBtnActive : ''}`}
              onClick={() => setShowPaymentsMenu(p => !p)}
            >
              Plaćanja
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showPaymentsMenu && (
              <div className={styles.payDropdownMenu}>
                {paymentsSubItems.map(item => (
                  <button
                    key={item.label}
                    className={styles.payDropdownItem}
                    onClick={() => { navigate(item.path); setShowPaymentsMenu(false); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className={styles.headerRight}>
          <button className={styles.headerProfile}>
            <div className={styles.headerAvatar}>{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
            <span>{user?.first_name} {user?.last_name}</span>
          </button>
          <button className={styles.headerLogout} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Odjavi se
          </button>
        </div>
      </header>

      {/* SADRŽAJ */}
      <div className={styles.content}>
        <div className={styles.pageHead}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>← Nazad</button>
          <div>
            <h1 className={styles.pageTitle}>Istorija transfera</h1>
            <p className={styles.pageSub}>Svi vaši transferi, sortirani od najnovijeg ka najstarijem.</p>
          </div>
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.spinnerWrap}><Spinner /></div>
          ) : error ? (
            <div className={styles.empty}>Greška pri učitavanju transfera.</div>
          ) : transfers.length === 0 ? (
            <div className={styles.empty}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--tx-3)" strokeWidth="1.5">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              <p>Nema transfera za prikaz.</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Datum i vreme</th>
                      <th>Sa računa</th>
                      <th>Na račun</th>
                      <th style={{ textAlign: 'right' }}>Poslato</th>
                      <th style={{ textAlign: 'right' }}>Primljeno</th>
                      <th style={{ textAlign: 'right' }}>Provizija</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((tx) => (
                      <tr key={tx.transfer_id ?? tx.transaction_id}>
                        <td className={styles.tdDate}>
                          {formatDateTime(tx.created_at)}
                        </td>
                        <td className={styles.tdAccount}>
                          {shortAccount(tx.from_account_number)}
                        </td>
                        <td className={styles.tdAccount}>
                          {shortAccount(tx.to_account_number)}
                        </td>
                        <td className={styles.debit} style={{ textAlign: 'right' }}>
                          -{formatAmount(tx.initial_amount)}
                        </td>
                        <td className={styles.credit} style={{ textAlign: 'right' }}>
                          +{formatAmount(tx.final_amount)}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--tx-3)', fontSize: 12 }}>
                          {formatAmount(tx.commission)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prethodna</button>
                  <span className={styles.pageNum}>Strana {page} od {totalPages}</span>
                  <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sledeća →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
