import Hero from '../components/layout/Hero';
import FeaturedCourses from '../components/courses/FeaturedCourses';
import AboutUs from '../components/layout/AboutUs';
import FAQ from '../components/layout/FAQ';
import Contact from '../components/layout/Contact';

export default function Landing() {
    return (
        <main className="flex flex-col">
            <Hero />
            <FeaturedCourses />
            <AboutUs />
            <FAQ />
            <Contact />
        </main>
    );
}
