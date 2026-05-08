"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Book } from "@/data/mock";
import Link from "next/link";

interface Props { book: Book }

export default function BookCard({ book }: Props) {
  return (
    <Link href={`/livro/${book.id}`} className="block w-full">
      <motion.div
        className="relative group w-full cursor-pointer overflow-hidden rounded-md"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.65, 0.05, 0, 1] }}
      >
        <div className="relative w-full aspect-[2/3]">
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover rounded-md"
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-400 rounded-md flex flex-col justify-end p-4">
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
              <p className="text-white font-bold text-base">R$ {book.price.toFixed(2).replace(".", ",")}</p>
              <button className="mt-2 w-full bg-accent text-white py-2 text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 px-1">
          <h4 className="font-serif font-bold text-sm leading-tight truncate group-hover:text-brand transition-colors duration-300">
            {book.title}
          </h4>
          {book.subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{book.subtitle}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
