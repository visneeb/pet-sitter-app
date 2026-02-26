"use client";

import Loading from "@/components/common/loading/loading";
import { useState } from "react";

export default function MapMode() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="relative w-[850px] h-[840px] rounded-2xl">
      {/* Loading overlay — แสดงระหว่าง iframe กำลังโหลด */}
      {isLoading && <Loading />}

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1936.9398520209363!2d100.56953638678628!3d13.846258683854362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d72e7282d85%3A0xc2ccb3281bcf44de!2z4LiE4LiT4Liw4Lin4Li04Lio4Lin4Liv4oCLIOC4oS7guYDguIHguKnguJXguKM!5e0!3m2!1sth!2sth!4v1771661260794!5m2!1sth!2sth"
        width="850"
        height="840"
        className="border-none rounded-2xl"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </section>
  );
}
