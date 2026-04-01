import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import gsap                                           from 'gsap';
import { useDebounce }                                from '../../hooks/useDebounce';
import Navbar                                         from '../../components/layout/Navbar';
import Alert                                          from '../../components/ui/Alert';
import TaxTable                                       from '../../features/tax/TaxTable';
import TaxFilters                                     from '../../features/tax/TaxFilters';
import TaxCalculationModal                            from '../../features/tax/TaxCalculationModal';
import styles                                         from './TaxPage.module.css';

// TODO: zameniti mock podatke pravim API pozivom kada backend bude spreman
const MOCK_USERS = [
  {
    id: 1, first_name: 'Marko', last_name: 'Nikolić', email: 'marko.nikolic@banka.rs',
    team: 'Klijent', tax_debt: 225.00, tax_paid: 0, tax_status: 'Neplaćen',
    accounts: [
      { account_number: '105-0000000001-11', currency: 'RSD', profit: 1500.00, tax_rsd: 225.00 },
    ],
  },
  {
    id: 2, first_name: 'Ana', last_name: 'Petrović', email: 'ana.petrovic@banka.rs',
    team: 'Aktuar', tax_debt: 525.75, tax_paid: 525.75, tax_status: 'Plaćen',
    accounts: [
      { account_number: '105-0000000002-22', currency: 'RSD', profit: 2250.00, tax_rsd: 337.50 },
      { account_number: '105-0000000003-33', currency: 'EUR', profit: 170.00,  tax_rsd: 188.25 },
    ],
  },
  {
    id: 3, first_name: 'Stefan', last_name: 'Jovanović', email: 'stefan.jovanovic@banka.rs',
    team: 'Klijent', tax_debt: 0, tax_paid: 0, tax_status: 'Bez duga',
    accounts: [
      { account_number: '105-0000000004-44', currency: 'RSD', profit: -500.00, tax_rsd: 0 },
    ],
  },
  {
    id: 4, first_name: 'Jelena', last_name: 'Stojanović', email: 'jelena.stojanovic@banka.rs',
    team: 'Aktuar', tax_debt: 731.25, tax_paid: 120.00, tax_status: 'Delimično',
    accounts: [
      { account_number: '105-0000000005-55', currency: 'RSD', profit: 4000.00, tax_rsd: 600.00 },
      { account_number: '105-0000000006-66', currency: 'USD', profit: 120.00,  tax_rsd: 131.25 },
    ],
  },
  {
    id: 5, first_name: 'Nikola', last_name: 'Đorđević', email: 'nikola.djordjevic@banka.rs',
    team: 'Klijent', tax_debt: 480.00, tax_paid: 200.00, tax_status: 'Delimično',
    accounts: [
      { account_number: '105-0000000007-77', currency: 'RSD', profit: 3200.00, tax_rsd: 480.00 },
    ],
  },
  {
    id: 6, first_name: 'Milica', last_name: 'Savić', email: 'milica.savic@banka.rs',
    team: 'Klijent', tax_debt: 90.00, tax_paid: 90.00, tax_status: 'Plaćen',
    accounts: [
      { account_number: '105-0000000008-88', currency: 'RSD', profit: 600.00, tax_rsd: 90.00 },
    ],
  },
  {
    id: 7, first_name: 'Dragan', last_name: 'Ilić', email: 'dragan.ilic@banka.rs',
    team: 'Aktuar', tax_debt: 1125.00, tax_paid: 0, tax_status: 'Neplaćen',
    accounts: [
      { account_number: '105-0000000009-99', currency: 'RSD', profit: 5000.00, tax_rsd: 750.00 },
      { account_number: '105-0000000010-00', currency: 'EUR', profit: 225.00,  tax_rsd: 375.00 },
    ],
  },
];

export default function TaxPage() {
  const pageRef = useRef(null);

  const [users, setUsers] = useState(MOCK_USERS);

  const [filters, setFilters] = useState({
    first_name: '',
    last_name:  '',
    team:       '',
    status:     '',
  });

  const [modalUser,   setModalUser]   = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [calcSuccess, setCalcSuccess] = useState(null);
  const [runAll,      setRunAll]      = useState(false);

  const debouncedFirstName = useDebounce(filters.first_name, 400);
  const debouncedLastName  = useDebounce(filters.last_name,  400);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (debouncedFirstName && !u.first_name.toLowerCase().includes(debouncedFirstName.toLowerCase())) return false;
      if (debouncedLastName  && !u.last_name.toLowerCase().includes(debouncedLastName.toLowerCase()))   return false;
      if (filters.team   && u.team       !== filters.team)   return false;
      if (filters.status && u.tax_status !== filters.status) return false;
      return true;
    });
  }, [users, debouncedFirstName, debouncedLastName, filters.team, filters.status]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-anim', {
        opacity:  0,
        y:        20,
        duration: 0.4,
        stagger:  0.08,
        ease:     'power2.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  // TODO: zameniti sa pravim API pozivom kada backend bude spreman
  async function handleRunCalculation(userId) {
    setCalculating(true);
    setCalcSuccess(null);
    await new Promise(r => setTimeout(r, 800));

    if (userId) {
      setUsers(prev => prev.map(u => {
        if (u.id !== userId) return u;
        const noviPorez = parseFloat((Math.random() * 1000).toFixed(2));
        return { ...u, tax_debt: noviPorez, tax_status: noviPorez > 0 ? 'Neplaćen' : 'Bez duga' };
      }));
    } else {
      setUsers(prev => prev.map(u => {
        const noviPorez = parseFloat((Math.random() * 1000).toFixed(2));
        return { ...u, tax_debt: noviPorez, tax_status: noviPorez > 0 ? 'Neplaćen' : 'Bez duga' };
      }));
    }

    setCalcSuccess(
      userId
        ? 'Obračun poreza je uspešno pokrenut za korisnika.'
        : 'Obračun poreza je uspešno pokrenut za sve korisnike.'
    );
    setModalUser(null);
    setRunAll(false);
    setCalculating(false);
  }

  return (
    <div ref={pageRef} className={styles.stranica}>
      <Navbar />

      <main className={styles.sadrzaj}>

        <div className="page-anim">
          <div className={styles.breadcrumb}>
            <span>Porez</span>
          </div>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Porez na kapitalnu dobit</h1>
              <p className={styles.pageDesc}>
                Pregled i upravljanje porezom na kapitalnu dobit za klijente i aktuare.
              </p>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={() => { setRunAll(true); setModalUser(null); }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Pokreni sve obračune
            </button>
          </div>
        </div>

        {calcSuccess && (
          <div className="page-anim">
            <Alert tip="uspeh" poruka={calcSuccess} />
          </div>
        )}

        <div className="page-anim">
          <TaxFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className={`page-anim ${styles.tableCard}`}>
          <TaxTable
            users={filteredUsers}
            onRunCalculation={(user) => { setModalUser(user); setRunAll(false); }}
          />
        </div>

      </main>

      {(modalUser || runAll) && (
        <TaxCalculationModal
          user={modalUser}
          bulk={runAll}
          loading={calculating}
          onConfirm={() => handleRunCalculation(modalUser?.id ?? null)}
          onClose={() => { setModalUser(null); setRunAll(false); }}
        />
      )}
    </div>
  );
}
