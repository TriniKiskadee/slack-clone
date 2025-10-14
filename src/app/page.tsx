import Image from "next/image";
import {AnimatedThemeToggler} from "@/components/ui/animated-theme-toggler";
import {AnimatedGroup} from "@/components/ui/animated-group";
import {HeroHeader} from "@/components/header";
import HeroSection from "@/components/hero-section";

export default function Home() {
    return (
        <div className={""}>
            <HeroHeader />
            <HeroSection />
        </div>
    );
}
