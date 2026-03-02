import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react'; // Modern ikonlar
import logo from '@/images/logo.png'; // Yolun klasörüne uygun olduğundan emin ol

export default function Footer() {
    const currentYear = new Date().getFullYear(); // Yılı otomatik alır (2026 vs.)

    return (
        <footer className="w-full bg-(--color-lumex-dark) text-(--color-lumex-light) py-12 px-6 border-t-4 border-(--color-lumex-purple-main) mt-auto">
            <div className='container mx-auto flex flex-col gap-8 items-center'>
                
                {/* Üst Kısım: Logo, Açıklama ve Sosyal Medya */}
                <div className='flex flex-col md:flex-row gap-8 w-full items-center justify-between'>
                    
                    {/* Logo ve Yazı */}
                    <div className='flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 max-w-3xl'>
                        <div className='bg-(--color-lumex-light) rounded-full p-2 w-28 h-28 flex items-center justify-center shrink-0 shadow-lg border-2 border-(--color-lumex-purple-light)'>
                            <Image 
                                src={logo} 
                                alt="Lumex Üniversitesi Logo" 
                                className='w-full h-full object-contain' 
                            />
                        </div>
                        <div className='text-center md:text-left'>
                            <h1 className='text-2xl font-bold mb-2 tracking-wide text-(--color-lumex-accent)'>
                                Lumex Üniversitesi
                            </h1>
                            <p className='text-sm md:text-base leading-relaxed text-(--color-lumex-light)/80'>
                                Hedefimiz, öncelikle insanlık değerlerine sahip, ülkemize faydalı, yenilikçi, teknolojiyi yakından takip eden ve geliştiren vizyon sahibi öğrenciler yetiştirmektir.
                            </p>
                        </div>
                    </div>

                    {/* Sosyal Medya İkonları (Lucide React kullanıldı) */}
                    <div className='flex flex-row items-center gap-4'>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Twitter size={20} />
                        </Link>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Facebook size={20} />
                        </Link>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Instagram size={20} />
                        </Link>
                        <Link href="#" className='bg-(--color-lumex-purple-deep) p-3 rounded-full hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all transform hover:scale-110 shadow-md'>
                            <Youtube size={20} />
                        </Link>
                    </div>
                </div>

                {/* Alt Kısım: Çizgi ve Telif Hakkı */}
                <div className='w-full border-t border-(--color-lumex-purple-deep) pt-6 text-center'>
                    <p className='text-sm text-(--color-lumex-light)/60'>
                        © {currentYear} Lumex Üniversitesi. Tüm hakları saklıdır.
                    </p>
                </div>
                
            </div>
        </footer>
    );
}