"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Book } from "@/data/mock";
import Link from "next/link";

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  return (
    <Link href={`/livro/${book.id}`}>
      <motion.div
        className="relative group min-w-[200px] md:min-w-[240px] flex-shrink-0 cursor-pointer overflow-hidden rounded-md"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-[300px] md:h-[360px] w-full">
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        
        {/* Overlay de hover */}
        <motion.div
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <p className="text-white font-bold text-lg">R$ {book.price.toFixed(2).replace(".", ",")}</p>
            <button className="mt-2 w-full bg-accent text-white py-2 font-semibold rounded-sm hover:bg-orange-600 transition-colors">
              Detalhes
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
