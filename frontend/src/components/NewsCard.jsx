// import React from 'react';
// import { formatDate, truncateText, getImagePlaceholder } from '../utils/helpers';

// const NewsCard = ({ article, darkMode }) => {
//     return (
//         <article className={`news-card ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//             <img
//                 src={article.image || getImagePlaceholder()}
//                 alt={article.title}
//                 className="w-full h-48 object-cover"
//                 onError={(e) => {
//                     e.target.src = getImagePlaceholder();
//                 }}
//                 loading="lazy"
//             />
//             <div className="p-5">
//                 <div className="flex items-center gap-2 mb-2">
//                     <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
//                         }`}>
//                         {article.source?.name || 'Unknown Source'}
//                     </span>
//                     <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                         {formatDate(article.publishedAt)}
//                     </span>
//                 </div>
//                 <h2 className={`text-xl font-bold mb-3 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'
//                     }`}>
//                     {article.title}
//                 </h2>
//                 <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     {truncateText(article.description || article.content, 150) || 'No description available.'}
//                 </p>
//                 <a
//                     href={article.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="btn-primary inline-block"
//                 >
//                     Read More →
//                 </a>
//             </div>
//         </article>
//     );
// };

// export default NewsCard;