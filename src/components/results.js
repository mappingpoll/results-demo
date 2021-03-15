import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { MarkupText, Text } from "preact-i18n";
import { reducer } from "../asyncReducer";

import { canShowCustomViz } from "../lib/misc";
import { Viz } from "./viz/viz";
import { INITIAL_STATE } from "../constants";
import Knobs from "./knobs";
import style from "./results.css";

function useAsyncReducer(reducer, initState) {
  const [state, setState] = useState(initState),
    dispatchState = async action => setState(await reducer(state, action));
  return [state, dispatchState];
}

export default function Results() {
  // STATE
  const [state, dispatch] = useAsyncReducer(reducer, INITIAL_STATE);
  useEffect(() => {
    if (state.data == null) dispatch({ type: "FETCH_DATA" });
  });

  const shouldShowCustomViz =
    state.customViz && canShowCustomViz(state.userAxes);

  function handleVizInput(input) {
    switch (input.type) {
      case "brush":
        dispatch({ type: "BRUSH", payload: input.payload });
        break;
    }
  }

  // const visuals = state.standardColumnSet.map(columns => (
  //   <Viz state={state} columns={columns} callback={handleVizInput} />
  // ));

  // JSX
  return (
    <div class={style.results}>
      <Knobs reducer={{ state, dispatch }} />
      {shouldShowCustomViz && (
        <div class={style.map}>
          <div class={style.maptitle}>
            <Text id="results.customgraph">Custom graph:</Text>
          </div>
          <div class={style.mapviz}>
            <Viz
              state={state}
              columns={state.vizColumns}
              callback={handleVizInput}
            />
          </div>
        </div>
      )}
      <div class={style.intro}>
        <MarkupText id="results.intro">
          <h1>Mapping Exercise:</h1>
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
            callback={handleVizInput}
          />
        </div>

        <div class={style.mapviz}>
          <Viz
            state={state}
            columns={state.standardColumnSet?.[1]}
            callback={handleVizInput}
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
              Think of the land where you grew up. Think of its natural physical
              properties, such as mountains, valleys, plains, forests, wetlands,
              rivers, lakes, sea, desert, etc. Then try to imagine this land in
              relation to the totality of physical spaces all across the globe.
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
            callback={handleVizInput}
          />
        </div>

        <div class={style.mapviz}>
          <Viz
            state={state}
            columns={state.standardColumnSet?.[3]}
            callback={handleVizInput}
          />
        </div>

        <div class={style.mapviz}>
          <Viz
            state={state}
            columns={state.standardColumnSet?.[4]}
            callback={handleVizInput}
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
            callback={handleVizInput}
          />
        </div>

        <div class={style.mapviz}>
          <Viz
            state={state}
            columns={state.standardColumnSet?.[6]}
            callback={handleVizInput}
          />
        </div>

        <div class={style.mapviz}>
          <Viz
            state={state}
            columns={state.standardColumnSet?.[7]}
            callback={handleVizInput}
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
            callback={handleVizInput}
          />
        </div>
      </div>
      <footer>
        <div>
          <MarkupText id="results.footer">
            <h2>Track specific respondents</h2>
            <p>
              You can draw a rectangle around a selection of dots, and you will
              then see how the participants corresponding to those dots answered
              from one question to the next.
            </p>
          </MarkupText>
        </div>
      </footer>
    </div>
  );
}
