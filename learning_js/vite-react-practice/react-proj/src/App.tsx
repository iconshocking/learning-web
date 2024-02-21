import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [firstRender, setFirstRender] = useState(true);
  const [title, setTitle] = useState("React Proj");
  const [titleHidden, setTitleHidden] = useState(false);
  const [inputHidden, setInputHidden] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current && !firstRender) {
      inputRef.current.focus();
    }
  }, [inputHidden]);

  function setNewTitle(clickCount: number) {
    let message = `Hello! 😀`;
    if (clickCount >= 1) {
      message = `Okay... 😑`;
    }
    if (clickCount >= 5) {
      message = `Stop it! 😡`;
    }
    setTitle(message);
  }

  function toggleTitleHidden() {
    setTitleHidden((titleHidden) => !titleHidden);
  }

  //  must be last hook since hook executuion always runs in the same order within a component
  useEffect(() => {
    setFirstRender(false);
    /* note that cleanup function is not called when navigating outside the SPA, which can create
    weird behavior if the use uses back navigation to return to the SPA if it is restored via the
    forward-back cache */
    return () => {
      console.log("does nothing but is illustrative");
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev">
          <img
            src={viteLogo}
            className="logo"
            alt="Vite logo"
            height="24px"
            width="24px"
          />
        </a>
        <a href="https://react.dev">
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
            height="24px"
            width="24px"
          />
        </a>
      </div>
      {/* using && vs ? avoids needing to stub in a false case everytime */}
      {!titleHidden && <h1>{title}</h1>}
      <p>Built with:</p>
      <ul>
        <li>
          Vite via <code>create vite</code> w/ React template
        </li>
        <li>React plugin w/ SWC for compilation</li>
        <li>TSC for type checks only</li>
      </ul>
      <p>
        Using <code>nanoid</code> for generating unique element IDs.
      </p>

      <p>
        CSS import of <code>App.css</code> and <code>index.css</code> doesn't
        import anything for JS code, but it allows Vite to crawl for which CSS
        files are referenced via JS (or other CSS) reachable via site entry
        points (default is <code>index.html</code> only). <code>dummy.css</code>{" "}
        is not inlcuded in the final <code>dist</code> CSS file because it is
        not imported or linked by any file.
      </p>

      <p>Few React property differences from HTML:</p>
      <ul>
        <li>
          <code>className</code> instead of <code>class</code>
        </li>
        <li>
          <code>defaultChecked</code> instead of <code>checked</code>
        </li>
        <li>
          <code>htmlFor</code> instead of <code>for</code> (when using labels)
        </li>
        <li>
          <code>on[Event]</code> instead of <code>on[event]</code> (which adds
          an event listener instead of setting the attribute in HTML)
        </li>
      </ul>

      <h3>List rendering</h3>
      <p style={{ backgroundColor: "red" }}>
        Aleays remember to provide iterated components with <code>key</code>{" "}
        properties, so React can optimize re-rendering.
      </p>
      <div style={{ backgroundColor: "navy" }}>
        {["jeff", "jim", "joe"].map((name, index) => (
          <SubComponent id={nanoid()} key={index} name={name} />
        ))}
      </div>

      <h3>Conditional rendering</h3>
      <SubButton
        text="Click me to change title"
        onClick={setNewTitle}
      ></SubButton>
      <SubButton
        text={`Click me to ${titleHidden ? "show" : "hide"} title!`}
        onClick={toggleTitleHidden}
      ></SubButton>

      <p>
        Also remember that HTML can keep track of some button states
        automatically without React setting any state changes, so always make
        sure to set click/change listeners on buttons if they are keeping track
        of state.
      </p>

      <h3>Focus Accessibility</h3>
      <p>
        Always make sure that focus is accounted for when conditionally
        rendering elements since it can be confusing when either
      </p>
      <ol>
        <li>
          focus jumps to a random element after a focused element is hidden
        </li>
        <li>
          of focus does not move at all or not to the logical place after an
          element has become visible
        </li>
      </ol>

      <p>
        Additionally, test focus changes when navigating a SPA because unlike a
        standard HTML page, where navigating moves focus to the top of the page
        (specifically the <code>body</code>), focus (AND history) are not
        changed at all in SPA navigation by default.
      </p>
      {!inputHidden && (
        <label htmlFor="hideable">
          type something:
          <input type="text" id="hideable" ref={inputRef} />
        </label>
      )}
      <button
        style={{ display: "block" }}
        onClick={() => setInputHidden((inputHidden) => !inputHidden)}
      >
        Click me to show/hide button
      </button>
    </>
  );
}

function SubComponent(props: { id: string; name: string }) {
  return <p id={props.id}>I'm a component with name {props.name}!</p>;
}

function SubButton(props: {
  text: string;
  onClick: (clickCount: number) => void;
}) {
  const [count, setCount] = useState(0);

  return (
    <button
      style={{ display: "block" }}
      onClick={(e) => {
        e.preventDefault();
        props.onClick(count);
        setCount((count) => count + 1);
      }}
    >
      Click me to have something happen!
    </button>
  );
}

export default App;
