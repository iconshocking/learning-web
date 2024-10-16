import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import readerImg from "../assets/images/reader.jpg";
import "../assets/styles/home.css";
import { useHeadTitle } from "../hooks/useHeadTitle";
import { getQueryOptions } from "../queries/queries";
import { routerPathsMap } from "../routes";

function Home() {
  useHeadTitle("Local Library Home");

  const testQuery = useQuery(getQueryOptions(["author-count"]));

  const lateFadeInRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.add("fadein");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(lateFadeInRef.current!);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* not aligned with anything but visually feels correct */}
      <div className="px-1 py-3">
        <div className="fadein">
          <h1>A library that works for you</h1>
          <p>
            Welcome to an example local library! (
            <a href="https://github.com/iconshocking/local-library" className="a-strong">
              source code here
            </a>
            )
          </p>
        </div>
      </div>
      <div className="home-content-container">
        <p>Use the navigation menu at the top to get around! (Mobile-friendly!)</p>
        <p>
          <Link className="a-strong" to={routerPathsMap.get("home")!.path!}>
            Sign up
          </Link>
          {" to borrow and create books as well as authors!"}
        </p>
      </div>
      <div className="home-content-container mt-5 mb-4">
        <div className="home-detail-flex">
          <img
            src={readerImg}
            height={768}
            width={512}
            alt="woman reading book in dim, cozy room"
          />
          <div className="ms-4 d-flex flex-column justify-content-between flex-grow-1">
            <div className="flex-grow-0">
              <p>A few stats about the library:</p>
              <ul className="my-auto">
                <li>
                  <p>
                    <strong>{JSON.stringify(testQuery.data)} authors,</strong> spanning languages
                    from French to Hindi.
                  </p>
                </li>
                <li>
                  <p>
                    {/* <strong>{{ num_books }} books,</strong> with genres from science fiction to */}
                    history.
                  </p>
                </li>
                <li>
                  <p>{/* <strong>{{ num_instances }} copies</strong> on the shelves. */}</p>
                </li>
              </ul>
            </div>
            <div className="flex-grow-0">
              <p>
                <strong>Tip!</strong> Don't see an available copy? No problem!
              </p>
              <p>Create new copies for any book on its detail page.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-1 mb-3">
        <div className="fadein">
          <p ref={lateFadeInRef} className="display-6 fw-bold opacity-0 mb-0">
            Enjoy your visit 👋
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
