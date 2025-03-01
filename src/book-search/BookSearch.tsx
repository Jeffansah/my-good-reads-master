import React, { useCallback, useEffect, useRef, useState } from "react";
import { getBooksByType } from "./book-search.service";
import SearchBar from "./search-bar";
import Books from "./books";
import { Book, BooksResponse } from "../types/books.types";

// const BookSearch = () => {
//     const [bookType, updateBookType] = useState("");
//     const [bookTypeToSearch, updateBookTypeToSearch] = useState("");
//     const [allAvailableBooks, setAllAvailableBooks] = useState([]);
//     async function requestBooks() {
//         if (bookTypeToSearch) {
//             const allBooks = await getBooksByType(bookTypeToSearch);
//             setAllAvailableBooks(allBooks);
//         }
//     }

//     useEffect(() => {
//         async function getAllBooks() {
//             await requestBooks();
//         }
//         getAllBooks();
//     }, [bookTypeToSearch]);
//     return (
//             <>
//                 <div className="book--container">
//                     <div className="search-params">
//                         <div>
//                             <form
//                                 onSubmit={(e) => {
//                                     debugger;
//                                     e.preventDefault();
//                                    updateBookTypeToSearch(bookType)
//                                 }}
//                             >
//                                 <input
//                                     className="full-width"
//                                     autoFocus
//                                     name="gsearch"
//                                     type="search"
//                                     value={bookType}
//                                     placeholder="Search for books to add to your reading list and press Enter"
//                                     onChange={e => updateBookType(e.target.value)}
//                                 />
//                             </form>
//                             {!bookType && (
//                                 <div className="empty">
//                                     <p>
//                                         Try searching for a topic, for example
//                                         <a onClick={() => {
//                                                 updateBookType("Javascript");
//                                             }}
//                                         >
//                                             {" "}
//                                             "Javascript"
//                                         </a>
//                                     </p>
//                                 </div>
//                             )}

//                         </div>
//                     </div>
//                 </div>
//                 {                <pre>{JSON.stringify(allAvailableBooks, null, 4)}</pre>
//                 }
//             </>
//     );
// };

const BookSearch = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBooks = useCallback(async (query: string, page: number) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}`
      );
      const data = (await response.json()) as BooksResponse;
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchBooks(query, 1);
      }, 300);
    },
    [fetchBooks]
  );

  return (
    <div className="container">
      <div>
        <div className="search-books">
          <SearchBar onSearch={handleSearch} />
          <Books
            books={books}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </div>
        <div className="wishlist"></div>
      </div>
    </div>
  );
};

export default BookSearch;
