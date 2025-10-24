import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Configs = {
  //url:"http://localhost:6060"
   url:"https://church-server-p458.onrender.com"

}
