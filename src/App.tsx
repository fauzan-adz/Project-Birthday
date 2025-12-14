// App.tsx (atau di Layout komponen Anda)
import { useState, useEffect } from 'react';
import { Preloader } from './components/Preloading';
import Section1 from './components/section/Section1';
import Section2 from './components/section/Section2';
import Section3 from './components/section/Section3';
import Section4 from './components/section/Section4';


export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); 
        return () => clearTimeout(timer);
    }, []); 

    return (
        <>
            <Preloader isLoading={isLoading} />
            <main>
                <Section1 />
                <Section3 />
                <Section4 />
                <Section2 />
            </main>
        </>
    );
}