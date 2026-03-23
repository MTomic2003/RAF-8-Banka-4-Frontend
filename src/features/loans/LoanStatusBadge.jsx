import styles from './LoanStatusBadge.module.css';

const STATUS_MAP = {
  'PENDING':       { mod: 'amber', label: 'Na čekanju'  },
  'NA ČEKANJU':    { mod: 'amber', label: 'Na čekanju'  },
  'IN_PROGRESS':   { mod: 'amber', label: 'U obradi'    },
  'PROCESSING':    { mod: 'amber', label: 'U obradi'    },
  'U OBRADI':      { mod: 'amber', label: 'U obradi'    },
  'IN_REVIEW':     { mod: 'amber', label: 'U proveri'   },
  'U PROVERI':     { mod: 'amber', label: 'U proveri'   },
  'APPROVED':      { mod: 'green', label: 'Odobreno'    },
  'ODOBRENO':      { mod: 'green', label: 'Odobreno'    },
  'REJECTED':      { mod: 'red',   label: 'Odbijeno'    },
  'ODBIJENO':      { mod: 'red',   label: 'Odbijeno'    },
  'ACTIVE':        { mod: 'green', label: 'Aktivan'     },
  'PAID':          { mod: 'green', label: 'Plaćeno'     },
  'PLAĆENO':       { mod: 'green', label: 'Plaćeno'     },
  'COMPLETED':     { mod: 'green', label: 'Završeno'    },
  'UNPAID':        { mod: 'gray',  label: 'Neplaćeno'   },
  'OVERDUE':       { mod: 'red',   label: 'Zakasnelo'   },
};

export default function LoanStatusBadge({ status }) {
  const { mod, label } = STATUS_MAP[status] ?? { mod: 'gray', label: status };
  return (
    <span className={`${styles.badge} ${styles[mod]}`}>
      {label}
    </span>
  );
}
