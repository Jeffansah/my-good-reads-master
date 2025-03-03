import React, { useCallback, useRef, useState } from "react";
import SearchBar from "./search-bar";
import Books from "./books";
import { Book, BooksResponse } from "../types/books.types";
import Pagination from "./pagination";
import Wishlist from "../wishlist/wishlist";

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
  // State for managing books, loading state, search query, and pagination
  const [books, setBooks] = useState<Book[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Refs for tracking last search and debouncing
  const lastSearchRef = useRef("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch books from Google Books API with pagination
  const fetchBooks = useCallback(async (query: string, page: number) => {
    // Clear results if query is empty
    if (!query.trim()) {
      setBooks([]);
      setTotalItems(0);
      return;
    }

    setIsLoading(true);
    lastSearchRef.current = query;

    try {
      // Calculate pagination offset
      const startIndex = (page - 1) * itemsPerPage;

      // Fetch books from API
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&startIndex=${startIndex}&maxResults=${itemsPerPage}`
      );

      const data = (await response.json()) as BooksResponse;
      const fetchedTotalItems = data.totalItems || 0;

      // Cap total items at 1000 and calculate total pages
      const adjustedTotalItems = Math.min(fetchedTotalItems, 1000);
      const totalPages = Math.ceil(adjustedTotalItems / itemsPerPage);

      // Update state with fetched books or clear if no results
      if (data.items && data.items.length > 0) {
        setBooks(data.items);
        setTotalItems(adjustedTotalItems);
        setCurrentPage(Math.min(page, totalPages));
      } else {
        setBooks(null);
        setTotalItems(0);
        setCurrentPage(1);
      }
    } catch (error) {
      // Clear state on error
      setBooks(null);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle page changes in pagination
  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page > totalPages) {
      console.warn(`Invalid page request: ${page}. Max allowed: ${totalPages}`);
      return;
    }
    fetchBooks(searchQuery, page);
  };

  // Handle search with debouncing
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchBooks(query, 1);
      }, 500);
    },
    [fetchBooks]
  );

  return (
    <div className="container" data-testid="book-search">
      <div>
        <div className="search-books">
          <SearchBar onSearch={handleSearch} />
          <Books
            books={books}
            isLoading={isLoading}
            searchQuery={searchQuery}
            totalItems={totalItems}
          />
          {/* Show pagination only if there are results */}
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <Wishlist />
      </div>
    </div>
  );
};

export default BookSearch;
