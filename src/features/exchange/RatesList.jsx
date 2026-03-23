// src/features/exchange/RatesList.jsx
import { useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { exchangeApi } from '../../api/endpoints/exchange';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import ExchangeTable from './ExchangeTable';
import styles from './RatesList.module.css';
import gsap from 'gsap';

export default function RatesList() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const { data: ratesData, loading, error } = useFetch(() => exchangeApi.getRates(), []);

    const rates = Array.isArray(ratesData?.rates) ? ratesData.rates
        : Array.isArray(ratesData) ? ratesData : [];

    useLayoutEffect(() => {
        if (!rates.length) return;
        const ctx = gsap.context(() => {
            gsap.from('.page-anim', {
                opacity: 0,
                y: 20,
                duration: 0.45,
                stagger: 0.08,
                ease: 'power2.out',
            });
        }, pageRef);
        return () => ctx.revert();
    }, [rates]);

    if (loading) return <Spinner />;
    if (error)   return <Alert tip="greska" poruka={error.message || 'Ne mogu da učitam kursnu listu.'} />;
    if (!rates.length) return null;

    return (
        <div ref={pageRef} className={styles.stranica}>
            <main className={styles.sadrzaj}>
                <div className="page-anim">
                    <div className={styles.breadcrumb}>
                        <span>Menjačnica</span>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span className={styles.breadcrumbActive}>Kursna lista</span>
                    </div>

                    <div className={styles.pageHeader}>
                        <div>
                            <button className={styles.backBtn} onClick={() => navigate('/client/exchange')}>← Nazad</button>
                            <h1 className={styles.pageTitle}>Kursna lista</h1>
                            <p className={styles.pageDesc}>
                                Kupovni i prodajni kursevi banke — ažurirano {new Date().toLocaleDateString('sr-RS')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`page-anim ${styles.tableCard}`}>
                    <ExchangeTable rates={rates} />
                </div>
            </main>
        </div>
    );
}