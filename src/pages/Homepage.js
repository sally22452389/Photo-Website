import { useState, useEffect } from "react";
import Picture from "../components/Picture";

const Homepage = () => {
  const [data, setData] = useState(null);
  const [input, setInput] = useState("");
  const [nextPage, setNextPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");

  const authKey = "563492ad6f91700001000001a8a85c4c9af74a8685073797d8130665";
  const initialUrl = `https://api.pexels.com/v1/curated?page=1&per_page=8`;

  useEffect(() => {
    search(initialUrl, false);
    setNextPage(nextPage + 1);
  }, []);

  //Get search string
  function inputHandler(e) {
    setInput(e.target.value);
  }

  function searchHandler() {
    setNextPage(2);
    setCurrentSearch(input);
    if (input) {
      const searchUrl = `https://api.pexels.com/v1/search?query=${input}&page=1&per_page=8`;
      search(searchUrl, false);
    } else {
      search(initialUrl, false);
    }
  }

  //Show more pages
  function loadMoreHandler() {
    let loadUrl = `https://api.pexels.com/v1/curated?page=${nextPage}&per_page=8`;
    if (currentSearch) {
      loadUrl = `https://api.pexels.com/v1/search?query=${currentSearch}&page=${nextPage}&per_page=8`;
    }
    search(loadUrl, true);
    setNextPage(nextPage + 1);
  }

  async function search(url, merge) {
    const fetchData = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: authKey,
      },
    });
    const parsedData = await fetchData.json();

    if (merge) {
      setData(data.concat(parsedData.photos));
    } else {
      setData(parsedData.photos);
    }
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="search">
        <input onChange={inputHandler} type="text" />
        <button onClick={searchHandler}>Search</button>
      </div>
      <div className="pictures">
        {data && data.map((d) => <Picture key={d.id} data={d} />)}
      </div>
      <div className="loadmore">
        <button onClick={loadMoreHandler}>Load More {currentSearch}</button>
      </div>
    </div>
  );
};

export default Homepage;
