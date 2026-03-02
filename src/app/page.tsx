import Slider from "@/components/home/Slider"; 
import Announcements from "@/components/home/Announcements";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-(--color-lumex-light)">
      <Slider />

      <Announcements />

    </div>
  );
}