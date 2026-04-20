"use client";

import Image from "next/image";
import { Author } from "@/data/mock";
import Link from "next/link";

interface Props {
  author: Author;
}

export default function AuthorCard({ author }: Props) {
  return (
    <Link href={`/autor/${author.id}`} className="flex flex-col items-center min-w-[120px] md:min-w-[150px] flex-shrink-0 cursor-pointer group">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-black transition-all duration-300">
        <Image
          src={author.photoUrl}
          alt={author.name}
          width={128}
          height={128}
          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <h4 className="font-serif font-bold text-lg text-center group-hover:text-accent transition-colors">
        {author.name}
      </h4>
    </Link>
  );
}
