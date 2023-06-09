import { El, DB } from '@/library';
import { Textfield } from '@/components';
import { svgs } from '@/assets';
import { debounce } from 'lodash/function';
import { spiner } from '@/components';

const apiRequest = new DB();
apiRequest.setBaseUrl('https://api.openweathermap.org/data/2.5');

let historySearch = JSON.parse(localStorage.getItem('History')) || [];

const renderCard = (data, elem) => {
  if (data.cod !== 200) {
    elem.innerHTML = data.message;
  } else {
    const details = El({
      element: 'div',
      className: 'w-full flex flex-col items-center gap-2',
      children: [
        El({
          element: 'span',
          className: 'font-semibold',
          innerText: data.name + ' , ' + data.sys.country,
        }),
        El({
          element: 'div',
          className: 'w-full flex items-center justify-center gap-16',
          children: [
            svgs[data.weather[0].icon]
              ? El({
                  element: 'span',
                  className:
                    '[&_svg]:w-24 [&_path]:fill-slate-700 dark:[&_path]:fill-slate-200',
                  innerHTML: svgs[data.weather[0].icon],
                })
              : El({
                  element: 'img',
                  className: 'w-16',
                  src: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
                }),
            El({
              element: 'div',
              className: 'flex flex-col items-center justify-center',
              children: [
                El({
                  element: 'span',
                  className: 'font-semibold',
                  innerText: data.weather[0].main,
                }),
                El({
                  element: 'span',
                  className: 'text-sm',
                  innerText: data.weather[0].description,
                }),
              ],
            }),
          ],
        }),
        El({
          element: 'div',
          className:
            'w-full bg-transparent border-t border-slate-700 dark:border-slate-200',
        }),
        El({
          element: 'div',
          className: 'w-full flex items-end justify-center gap-16',
          children: [
            El({
              element: 'div',
              className: 'flex items-start justify-center',
              children: [
                El({
                  element: 'span',
                  className: 'text-6xl font-bold',
                  innerText: parseInt(data.main.temp),
                }),
                El({
                  element: 'span',
                  className: 'text-lg',
                  innerText: 'o',
                }),
                El({
                  element: 'span',
                  className: 'text-4xl',
                  innerHTML: ' C',
                }),
              ],
            }),
            El({
              element: 'span',
              className: 'text-2xl',
              innerText:
                parseInt(data.main.temp_max) +
                '/' +
                parseInt(data.main.temp_min),
            }),
          ],
        }),
        El({
          element: 'span',
          className: 'text-lg',
          innerText: new Date().toDateString(),
        }),
        El({
          element: 'div',
          className:
            'w-full bg-transparent border-t border-slate-700 dark:border-slate-200',
        }),
        El({
          element: 'div',
          className: ' flex flex-col items-start justify-between gap-2',
          children: [
            El({
              element: 'div',
              className: 'flex items-center justify-between gap-10',
              children: [
                El({
                  element: 'span',
                  className:
                    '[&_svg]:w-8 [&_path]:fill-slate-600 dark:[&_path]:fill-slate-100 w-5',
                  innerHTML: svgs.Wind,
                }),
                El({
                  element: 'span',
                  className:
                    ' w-16 border-r-2 border-slate-600 dark:border-slate-200',
                  innerText: 'Wind',
                }),
                El({
                  element: 'span',
                  className: '',
                  innerText: data.wind.speed,
                }),
              ],
            }),
            El({
              element: 'div',
              className: 'flex items-center justify-between gap-10',
              children: [
                El({
                  element: 'span',
                  className:
                    '[&_path]:fill-blue-600 dark:[&_path]:fill-slate-100 w-5',
                  innerHTML: svgs.Humid,
                }),
                El({
                  element: 'span',
                  className:
                    'text-left w-16 border-r-2 border-slate-600 dark:border-slate-200',
                  innerText: 'Humid',
                }),
                El({
                  element: 'span',
                  className: '',
                  innerText: data.main.humidity,
                }),
              ],
            }),
          ],
        }),
      ],
    });
    elem.innerHTML = '';
    elem.appendChild(details);
  }
};
const renderHistory = () => {
  const searchHistory =
    document.getElementById('search-history') ||
    El({
      element: 'div',
      className:
        'relative h-auto flex flex-row gap-4 md:flex-col col-span-2 md:col-span-1 overflow-x-scroll md:h-96 md:overflow-y-scroll scrollbar-hide hover:scroll-auto',
    });
  searchHistory.innerHTML = '';
  historySearch = JSON.parse(localStorage.getItem('History'));
  if (historySearch) {
    historySearch.map((item) => {
      apiRequest.setEndPoint(
        `weather?q=${item}&appid=c2a5e5757bf8e2de367336c584de74bd&units=metric`
      );
      apiRequest.getDB().then((data) => {
        const row = El({
          element: 'div',
          dataset: {
            name: data.name,
          },
          className:
            'w-full h-20 max-w-xs flex items-center justify-between flex-shrink-0 gap-2 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-600 dark:border-gray-700 cursor-pointer bg-opacity-40 dark:bg-opacity-40',
          children: [
            svgs[data.weather[0].icon]
              ? El({
                  element: 'span',
                  className:
                    '[&_svg]:w-20 [&_path]:fill-slate-700 dark:[&_path]:fill-slate-200',
                  innerHTML: svgs[data.weather[0].icon],
                })
              : El({
                  element: 'img',
                  className: 'w-16',
                  src: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
                }),
            // El({
            //   element: 'div',
            //   className:
            //     'w-full bg-transparent border-t border-slate-700 dark:border-slate-200',
            // }),
            El({
              element: 'div',
              className: 'flex flex-col items-center',
              children: [
                El({
                  element: 'span',
                  className: 'text-sm truncate md:text-md md:font-semibold',
                  innerText: data.name + ' , ' + data.sys.country,
                }),
                El({
                  element: 'span',
                  className: 'text-sm md:text-md',
                  innerText: data.weather[0].main,
                }),
              ],
            }),
            // El({
            //   element: 'div',
            //   className:
            //     'w-full bg-transparent border-t border-slate-700 dark:border-slate-200',
            // }),
            El({
              element: 'div',
              className: 'flex justify-center',
              children: [
                El({
                  element: 'span',
                  className: 'text-2xl md:text-4xl md:font-semibold',
                  innerText: parseInt(data.main.temp),
                }),
                El({
                  element: 'span',
                  className: 'text-sm md:text-lg',
                  innerText: 'o',
                }),
              ],
            }),
          ],
        });
        searchHistory.appendChild(row);
      });
    });
    // searchHistory.appendChild(
    //   El({
    //     element: 'div',
    //     className:
    //       'h-20 w-24 bg-gradient-to-l dark:bg-gradient-to-l from-[#3577F5] dark:from-[#203055] absolute right-0 md:h-24 md:w-full md:bg-gradient-to-t md:bottom-0',
    //   })
    // );
  }
  return searchHistory;
};

export const renderHome = () => {
  const weatherCard = document.getElementById('wheather-details');
  const content = document.getElementById('content');
  const searchBox = document.getElementById('search-box');
  const searchIcon = document.getElementById('search-icon');
  const search = document.getElementById('search');

  if (historySearch) {
    content.classList.add('opacity-100');
    content.classList.remove('opacity-0');
    searchIcon.classList.remove('top-6');
    searchIcon.classList.add('top-4');
    searchBox.classList.add('-translate-y-[4.5rem]');
    search.classList.remove('p-4', 'dark:bg-gray-600', 'bg-gray-200');
    search.classList.add('p-2.5', 'dark:bg-gray-700', 'bg-gray-50');
    apiRequest.setEndPoint(
      `weather?q=${historySearch[0]}&appid=c2a5e5757bf8e2de367336c584de74bd&units=metric`
    );
    weatherCard.innerHTML = '';
    weatherCard.appendChild(spiner());
    apiRequest.getDB().then((data) => {
      renderCard(data, weatherCard);
    });
    renderHistory();
  }
};

const searchHistoryHandler = (e) => {
  console.log(historySearch);
  const list = document.getElementById('prev-search');
  historySearch = JSON.parse(localStorage.getItem('History'));
  list.innerHTML = '';
  if (historySearch) {
    list.appendChild(
      El({
        element: 'li',
        className:
          'w-full bg-gray-100 flex items-center justify-start gap-4 p-2 px-4',
        children: [
          El({
            element: 'span',
            className: '[&_path]:fill-gray-600',
            innerHTML: svgs.SearchIcon,
          }),
          El({
            element: 'input',
            id: 'search-alt',
            autofocus: true,
            autocomplete: 'off',
            className:
              'bg-gray-200 bg-opacity-0 text-gray-900 text-md focus:outline-none w-full',
            placeholder: 'search',
            onchange: (e) => {
              console.log(e);
            },
            onkeyup: debounce(apiData, 500),
          }),
        ],
      })
    );
    const search = document.getElementById('search');
    const searchAlt = document.getElementById('search-alt');
    searchAlt.autofocus = true;
    // list.classList.remove('hidden');
    list.classList.add('scale-y-100');
    list.classList.remove('scale-y-0');
    searchAlt.value = search.value;
    search.disabled = true;
    historySearch.map((item) => {
      list.appendChild(
        El({
          element: 'li',
          onclick: (e) => {
            const weatherCard = document.getElementById('wheather-details');
            searchAlt.value = item;
            apiRequest.setEndPoint(
              `weather?q=${item}&appid=c2a5e5757bf8e2de367336c584de74bd&units=metric`
            );
            weatherCard.innerHTML = '';
            weatherCard.appendChild(spiner());
            apiRequest.getDB().then((data) => {
              renderCard(data, weatherCard);
              if (historySearch) {
                historySearch.length >= 6 ? historySearch.pop() : null;
                historySearch.unshift(data.name);
                historySearch = Array.from(new Set(historySearch));
                localStorage.setItem('History', JSON.stringify(historySearch));
              } else {
                let historySearch = [];
                historySearch.unshift(data.name);
                localStorage.setItem('History', JSON.stringify(historySearch));
              }
            });
          },
          className:
            'w-full flex items-center justify-start gap-4 p-2 px-4 text-slate-600 hover:bg-slate-300 cursor-pointer',
          children: [
            El({
              element: 'span',
              className: '[&_path]:fill-slate-600',
              innerHTML: svgs.History,
            }),
            El({
              element: 'span',
              className: '',
              innerHTML: item,
            }),
          ],
        })
      );
    });
    list.appendChild(
      El({
        element: 'li',
        className:
          'w-full flex items-center justify-center gap-4 p-2 px-4 text-slate-600 hover:bg-slate-600 hover:text-slate-100 cursor-pointer',
        children: [
          El({
            element: 'span',
            className: '',
            onclick: () => {
              localStorage.removeItem('History');
              document.getElementById('search').disabled = false;
              searchHistoryHandler();
              renderHistory();
            },
            innerHTML: 'Clear History',
          }),
        ],
      })
    );
  }
};

const apiData = (e) => {
  const weatherCard = document.getElementById('wheather-details');
  const content = document.getElementById('content');
  const searchBox = document.getElementById('search-box');
  const searchIcon = document.getElementById('search-icon');
  const search = document.getElementById('search');

  if (e.target.value === '') {
    search.value = '';
    document.getElementById('search-alt').value = '';
    renderHome();
  }
  apiRequest.setEndPoint(
    `weather?q=${e.target.value}&appid=c2a5e5757bf8e2de367336c584de74bd&units=metric`
  );
  weatherCard.innerHTML = '';
  weatherCard.appendChild(spiner());
  apiRequest.getDB().then((data) => {
    if (e.target.value === '' && !historySearch) {
      content.classList.add('opacity-0');
      content.classList.remove('opacity-100');
      searchIcon.classList.add('top-6');
      searchIcon.classList.remove('top-4');
      searchBox.classList.remove('-translate-y-[4.5rem]');
      search.classList.add('p-4', 'dark:bg-gray-600', 'bg-gray-200');
      search.classList.remove('p-2.5', 'dark:bg-gray-700', 'bg-gray-50');
      renderHome();
    } else {
      content.classList.add('opacity-100');
      content.classList.remove('opacity-0');
      searchIcon.classList.remove('top-6');
      searchIcon.classList.add('top-4');
      searchBox.classList.add('-translate-y-[4.5rem]');
      search.classList.remove('p-4', 'dark:bg-gray-600', 'bg-gray-200');
      search.classList.add('p-2.5', 'dark:bg-gray-700', 'bg-gray-50');
      renderCard(data, weatherCard);
      if (historySearch) {
        historySearch.unshift(data.name);
        historySearch = Array.from(new Set(historySearch));
        historySearch.length >= 6 ? historySearch.pop() : null;
        localStorage.setItem('History', JSON.stringify(historySearch));
        searchHistoryHandler();
        renderHistory();
      } else {
        let historySearch = [];
        historySearch.unshift(data.name);
        localStorage.setItem('History', JSON.stringify(historySearch));
        searchHistoryHandler();
        renderHistory();
      }
      console.log(data);
    }
  });
};

const historyHandler = (e) => {
  const weatherCard = document.getElementById('wheather-details');
  if (!e.target.closest('[data-name]')) return;
  const selected = e.target.closest('[data-name]').dataset.name;
  apiRequest.setEndPoint(
    `weather?q=${selected}&appid=c2a5e5757bf8e2de367336c584de74bd&units=metric`
  );
  weatherCard.innerHTML = '';
  weatherCard.appendChild(spiner());
  apiRequest.getDB().then((data) => {
    renderCard(data, weatherCard);
  });
};

export const home = () => {
  setTimeout(renderHome, 100);
  return El({
    element: 'div',
    className: 'text-slate-700 dark:text-slate-200',
    children: [
      El({
        element: 'div',
        id: 'search-box',
        className:
          'w-2/3 lg:w-2/4 xl:w-1/2 mx-auto relative transition ease-in-out duration-500 z-20',
        children: [
          Textfield({
            placeholder: 'search',
            id: 'search',
            variant: 'search',
            onkeyup: debounce(apiData, 500),
            eventListener: [
              {
                event: 'click',
                callback: searchHistoryHandler,
              },
              {
                event: 'keydown',
                callback: searchHistoryHandler,
              },
            ],
          }),
          El({
            element: 'span',
            id: 'search-icon',
            className: 'absolute left-2 top-6',
            innerHTML: svgs.SearchIcon,
          }),
          El({
            element: 'ul',
            id: 'prev-search',
            onmouseleave: (e) => {
              const search = document.getElementById('search');
              const searchAlt = document.getElementById('search-alt');
              search.value = searchAlt.value;
              search.disabled = false;
              // e.currentTarget.classList.add('hidden');
              e.currentTarget.classList.add('scale-y-0');
              e.currentTarget.classList.remove('scale-y-100');
            },
            className:
              'w-full bg-white scale-y-0 transition ease-in-out duration-300 origin-top transform divide-y divide-gray-300 shadow-md border border-slate-300 absolute top-0 rounded-md bg-opacity-90 z-30 overflow-hidden',
            children: [],
          }),
        ],
      }),
      El({
        element: 'div',
        id: 'content',
        className:
          'mx-12 grid grid-cols-2 gap-8 lg:mx-64 transition-opacity ease-in-out duration-500 opacity-0',
        children: [
          El({
            element: 'div',
            id: 'wheather-details',
            className:
              'w-full mx-auto flex items-center justify-center max-w-sm h-auto p-4 col-span-2 md:col-span-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-600 dark:border-gray-700 bg-opacity-40 dark:bg-opacity-40',
          }),
          El({
            element: 'div',
            id: 'search-history',
            eventListener: [
              {
                event: 'click',
                callback: historyHandler,
              },
            ],
            className:
              'relative h-auto flex flex-row gap-4 md:flex-col col-span-2 md:col-span-1 overflow-x-scroll md:h-96 md:overflow-y-scroll scrollbar-hide',
            children: [renderHistory()],
          }),
        ],
      }),
    ],
  });
};
