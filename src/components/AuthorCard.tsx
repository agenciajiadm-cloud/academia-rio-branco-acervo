"use client";

import Image from "next/image";
import { Author } from "@/data/mock";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props { author: Author }

export default function AuthorCard({ author }: Props) {
  return (
    <Link href={`/autor/${author.id}`} className="flex flex-col items-center group cursor-pointer w-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: [0.65, 0.05, 0, 1] }}
        className="flex flex-col items-center w-full"
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 ring-2 ring-transparent group-hover:ring-accent transition-all duration-400">
          <Image
            src={author.photoUrl}
            alt={author.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <h4 className="font-serif font-bold text-base text-center group-hover:text-accent transition-colors duration-300 link-anim">
          {author.name}
        </h4>
        {author.cadeira && (
          <p className="text-xs text-gray-400 mt-1 text-center">{author.cadeira.split("—")[0].trim()}</p>
        )}
      </motion.div>
    </Link>
  );
}
