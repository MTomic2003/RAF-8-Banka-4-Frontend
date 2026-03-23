// src/features/exchange/ExchangeTable.jsx
import styles from './RatesList.module.css';

const FLAG_EMOJI = {
    EUR: '🇪🇺', CHF: '🇨🇭', USD: '🇺🇸', GBP: '🇬🇧',
    JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺', RSD: '🇷🇸',
};

export default function ExchangeTable({ rates }) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.modernTable}>
                <thead>
                <tr>
                    <th>Valuta</th>
                    <th>Kupovni kurs</th>
                    <th>Srednji kurs</th>
                    <th>Prodajni kurs</th>
                </tr>
                </thead>
                <tbody>
                {rates.map(rate => {
                    const code = rate.code ?? rate.currency;
                    const buy  = rate.buy  ?? rate.buy_rate;
                    const sell = rate.sell ?? rate.sell_rate;
                    const mid  = rate.mid  ?? ((buy + sell) / 2);
                    return (
                        <tr key={code} className={styles.row}>
                            <td className={styles.currencyCell}>
                                <span className={styles.flagEmoji}>{FLAG_EMOJI[code] ?? '🏳️'}</span>
                                <span>{code}</span>
                            </td>
                            <td>{buy != null ? buy.toFixed(2) : '—'}</td>
                            <td className={styles.midRate}>{mid != null ? mid.toFixed(4) : '—'}</td>
                            <td>{sell != null ? sell.toFixed(2) : '—'}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}