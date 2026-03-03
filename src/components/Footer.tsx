import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
import logo from '@/images/logo.png';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-(--color-lumex-dark) text-(--color-lumex-light) py-8 md:py-12 px-4 md:px-6 border-t-4 border-(--color-lumex-purple-main) mt-auto">
            <div className='container mx-auto flex flex-col gap-6 md:gap-8 items-center'>
                
                <div className='flex flex-col md:flex-row gap-6 md:gap-8 w-full items-center justify-between'>
                    
                    <div className='flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6 max-w-3xl'>
                        <div className='bg-(--color-lumex-light) rounded-full p-2 w-20 h-20 md:w-28 md:h-28 flex items-center justify-center shrink-0 shadow-lg border-2 border-(--color-lumex-purple-light)'>
                            <Image 
                                src={logo} 
                                alt="Lumex Üniversitesi Logo" 
                                className='w-full h-full object-contain' 
                            />
                        </div>
                        <div className='text-center md:text-left'>
                            <h1 className='text-xl md:text-2xl font-bold mb-2 tracking-wide text-(--color-lumex-accent)'>
                                Lumex Üniversitesi
                            </h1>
                            <p className='text-sm md:text-base leading-relaxed text-(--color-lumex-light)/80'>
                                Hedefimiz, öncelikle insanlık değerlerine sahip, ülkemize faydalı, yenilikçi, teknolojiyi yakından takip eden ve geliştiren vizyon sahibi öğrenciler yetiştirmektir.
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-3 md:gap-4'>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-2.5 md:p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-2.5 md:p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-2.5 md:p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-2.5 md:p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                    </div>
                </div>

                <div className='w-full border-t border-(--color-lumex-purple-deep) pt-5 md:pt-6 text-center'>
                    <p className='text-xs md:text-sm text-(--color-lumex-light)/60'>
                        © {currentYear} Lumex Üniversitesi. Tüm hakları saklıdır.
                    </p>
                </div>
                
            </div>
        </footer>
    );
}