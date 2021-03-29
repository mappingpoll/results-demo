import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { MarkupText, Text } from "preact-i18n";
import { reducer } from "../asyncReducer";

import { canShowCustomViz } from "../lib/misc";
import { Viz } from "./viz/viz";
import { INITIAL_STATE } from "../constants";
import Knobs from "./knobs";
import style from "./results.css";
import Notify from "./notify";
import { cloneDeep } from "lodash";
import { useLanguageContext } from "../context/language-context";
import CollapsibleSection from "./collapsible-section";

function useAsyncReducer(reducer, initState) {
  const [state, setState] = useState(initState),
    dispatchState = async action => setState(await reducer(state, action));
  return [state, dispatchState];
}

export default function Results() {
  // STATE
  const [state, dispatch] = useAsyncReducer(reducer, cloneDeep(INITIAL_STATE));
  const [shouldShowKnobs, setShouldShowKnobs] = useState(true);
  const { swapLang } = useLanguageContext();

  useEffect(() => {
    if (state.data == null) dispatch({ type: "FETCH_DATA" });
  });

  const shouldShowCustomViz =
    state.customViz && canShowCustomViz(state.userAxes);

  let [notification, setNotification] = useState(null);

  const getLatestCount = () =>
    state.brushMap != null ? Object.keys(state.brushMap).length : 0;

  useEffect(() => {
    const latestCount = getLatestCount();
    if (latestCount !== 0) {
      setNotification(null);
      setTimeout(
        () =>
          setNotification(
            <Notify>
              <span>
                {latestCount}&nbsp;
                <Text id="results.knobs.selected">selected</Text>
              </span>
            </Notify>
          ),
        1
      );
    } else {
      setNotification(null);
    }
  }, [state.brushMap]);

  useEffect(() => {
    if (shouldShowCustomViz && introRef.current != null) {
      const y = introRef.current.getBoundingClientRect().bottom;
      window.scrollBy(0, y);
    }
  }, [shouldShowCustomViz, state.userAxes]);

  const introRef = useRef();
  const mapsRef = useRef();

  useEffect(() => {
    document.onscroll = () => {
      if (mapsRef.current != null) {
        const height = mapsRef.current.getBoundingClientRect().bottom;
        if (height < window.innerHeight / 2) setShouldShowKnobs(false);
        else {
          setShouldShowKnobs(true);
        }
      }
    };
  }, []);

  // JSX
  return (
    <div class={style.results}>
      <div ref={introRef} class={style.intro}>
        <div class={style["en-fr"]}>
          <span onclick={() => swapLang("en")}>English</span>&nbsp;/&nbsp;
          <span onclick={() => swapLang("fr")}>Français</span>
        </div>
        <MarkupText id="results.intro">
          <h1>
            Existential Issues:
            <br />A Mapping Exercise
          </h1>
          <p>
            In two of my recent exhibitions, I invited visitors to take a few
            minutes to fill a paper questionnaire comprising a variety of
            existential questions.
          </p>
          <p>
            Participants were asked to mark their position with a dot on a
            series of diagrams.
          </p>
          <h1>Results</h1>
          <p>In total, I received 1222 individual questionnaires.</p>
          <p>
            In the scatterplot graphs below (default presentation), each dot
            corresponds to the answer of one participant.
          </p>
          <p>The questions appear exactly as on the original questionnaire.</p>
        </MarkupText>
      </div>
      <Knobs
        reducer={{ state, dispatch }}
        selected={getLatestCount()}
        visible={shouldShowKnobs}
      />

      {notification}

      <div ref={mapsRef} class={style.maps}>
        {shouldShowCustomViz && (
          <div class={style.map}>
            <div class={style.maptitle}>
              <Text id="results.customgraph">Custom graph</Text>
            </div>
            <div class={style.mapviz}>
              <Viz
                state={state}
                columns={state.vizColumns}
                dispatch={dispatch}
              />
            </div>
          </div>
        )}

        <div class={style.map}>
          <div class={style.maptitle}>
            <div>
              <Text id="results.part">PART</Text> I
            </div>
            <div>
              <Text id="results.part1.title">YOU</Text>
            </div>
          </div>
          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[0]}
              dispatch={dispatch}
            />
          </div>

          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[1]}
              dispatch={dispatch}
            />
          </div>
        </div>
        <div class={style.map}>
          <div class={style.maptitle}>
            <div>
              <Text id="results.part">Part</Text> II
            </div>
            <div>
              <Text id="results.part2.title">You and the world</Text>
            </div>
          </div>
          <div class={style.mapdescription}>
            <MarkupText id="results.part2.description">
              <p>
                Think of the land where you grew up. Think of its natural
                physical properties, such as mountains, valleys, plains,
                forests, wetlands, rivers, lakes, sea, desert, etc. Then try to
                imagine this land in relation to the totality of physical spaces
                all across the globe.
              </p>
              <p>
                In your life, how much did you get to know the physical world?
              </p>
            </MarkupText>
          </div>
          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[2]}
              dispatch={dispatch}
            />
          </div>

          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[3]}
              dispatch={dispatch}
            />
          </div>

          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[4]}
              dispatch={dispatch}
            />
          </div>
        </div>
        <div class={style.map}>
          <div class={style.maptitle}>
            <div>
              <Text id="results.part">Part</Text> III
            </div>
            <div>
              <Text id="results.part3.title">You and the future</Text>
            </div>
          </div>
          <div class={style.mapdescription}>
            <MarkupText id="results.part3.description">
              <p>
                Try to picture the totality of human activities taking place on
                the planet today.
              </p>
              <p>
                Do you think that humanity as a whole is moving in a good
                direction, aligned with a coherent vision for the future?
              </p>
            </MarkupText>
          </div>
          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[5]}
              dispatch={dispatch}
            />
          </div>

          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[6]}
              dispatch={dispatch}
            />
          </div>

          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[7]}
              dispatch={dispatch}
            />
          </div>
        </div>
        <div class={style.map}>
          <div class={style.maptitle}>
            <div />
            <div>
              <Text id="results.part4.title">You and this exercise</Text>
            </div>
          </div>
          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.standardColumnSet?.[8]}
              dispatch={dispatch}
            />
          </div>
        </div>
      </div>
      <footer>
        <CollapsibleSection
          title={
            <Text id="results.footer.select">Select & Follow Respondents</Text>
          }
        >
          <p>
            <Text id="results.footer.select--body">
              You can draw a rectangle around a selection of dots, and you will
              then see how the participants corresponding to those dots answered
              from one question to the next.
            </Text>
          </p>
        </CollapsibleSection>
        <CollapsibleSection
          title={<Text id="results.footer.interpretation">Interpretation</Text>}
        >
          <p>
            <Text id="results.footer.interpretation--body">
              Phasellus a ultrices enim. Nam nulla elit, pellentesque sit amet
              maximus ut, fermentum nec risus. Nam gravida est leo, ac suscipit
              velit vestibulum sit amet. Nullam elementum neque risus, congue
              molestie sem egestas in. Ut sit amet imperdiet lacus. Integer
              mattis felis at semper posuere. Cras aliquam ac tortor a euismod.
              Aenean lorem odio, pretium ut nibh eget, fringilla pellentesque
              urna. Curabitur non lacinia arcu. Quisque in congue magna. Nulla
              ac metus at enim interdum luctus. In faucibus ex mauris, sed
              convallis leo congue sit amet. Integer sollicitudin ligula id
              ipsum pellentesque, a gravida leo scelerisque. Sed scelerisque
              nisl sit amet rhoncus bibendum. Etiam quis erat magna. Orci varius
              natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.{" "}
            </Text>
          </p>
        </CollapsibleSection>
        <CollapsibleSection
          title={<Text id="results.footer.context">Context</Text>}
        >
          <p>
            <Text id="results.footer.context--body">
              Phasellus a ultrices enim. Nam nulla elit, pellentesque sit amet
              maximus ut, fermentum nec risus. Nam gravida est leo, ac suscipit
              velit vestibulum sit amet. Nullam elementum neque risus, congue
              molestie sem egestas in. Ut sit amet imperdiet lacus. Integer
              mattis felis at semper posuere. Cras aliquam ac tortor a euismod.
              Aenean lorem odio, pretium ut nibh eget, fringilla pellentesque
              urna. Curabitur non lacinia arcu. Quisque in congue magna. Nulla
              ac metus at enim interdum luctus. In faucibus ex mauris, sed
              convallis leo congue sit amet. Integer sollicitudin ligula id
              ipsum pellentesque, a gravida leo scelerisque. Sed scelerisque
              nisl sit amet rhoncus bibendum. Etiam quis erat magna. Orci varius
              natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.{" "}
            </Text>
          </p>
        </CollapsibleSection>
        <section>
          <h1 lang="en">
            <Text id="results.footer.acknowledgements">
              Acknowledge&shy;ments
            </Text>
          </h1>
          <p>
            <Text id="results.footer.acknowledgements--bodu">
              Phasellus a ultrices enim. Nam nulla elit, pellentesque sit amet
              maximus ut, fermentum nec risus. Nam gravida est leo, ac suscipit
              velit vestibulum sit amet. Nullam elementum neque risus, congue
              molestie sem egestas in. Ut sit amet imperdiet lacus. Integer
              mattis felis at semper posuere. Cras aliquam ac tortor a euismod.
              Aenean lorem odio, pretium ut nibh eget, fringilla pellentesque
              urna. Curabitur non lacinia arcu. Quisque in congue magna. Nulla
              ac metus at enim interdum luctus. In faucibus ex mauris, sed
              convallis leo congue sit amet. Integer sollicitudin ligula id
              ipsum pellentesque, a gravida leo scelerisque. Sed scelerisque
              nisl sit amet rhoncus bibendum. Etiam quis erat magna. Orci varius
              natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.{" "}
            </Text>
          </p>
        </section>
      </footer>
    </div>
  );
}
