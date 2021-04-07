import { h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
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

  const getLatestCount = useCallback(
    () => (state.brushMap != null ? Object.keys(state.brushMap).length : 0),
    [state.brushMap]
  );

  useEffect(() => {
    const latestCount = getLatestCount();
    if (latestCount !== 0) {
      setNotification(null);
      setTimeout(
        () =>
          setNotification(
            <Notify visible={shouldShowKnobs}>
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
  }, [state.brushMap, shouldShowKnobs, getLatestCount]);

  useEffect(() => {
    if (shouldShowCustomViz && introRef.current != null) {
      const y = introRef.current.getBoundingClientRect().bottom;
      window.scrollBy(0, y);
    }
  }, [shouldShowCustomViz, state.userAxes]);

  const introRef = useRef();
  const mapsRef = useRef();
  const footerRef = useRef();

  let [showBackToTop, setShowBackToTop] = useState(false);

  let [footerSectionsState, setFooterSectionsState] = useState(0);
  const footerSection = {
    COMMENTS: 1,
    ANALYSIS: 2,
    CONSIDERATIONS: 4,
    ABOUT: 8,
  };
  function footerSectionIsOpen(section) {
    return (footerSectionsState & section) !== 0;
  }
  function toggleFooterSectionOpenClose(section) {
    setFooterSectionsState((footerSectionsState ^= section));
  }

  function collapseFooterSections() {
    setFooterSectionsState(0);
  }

  function handleToBottomClick() {
    const footerY = footerRef.current.getBoundingClientRect().top - 20;
    window.scrollTo(0, footerY);
  }

  function handleBackToTopClick() {
    const mapsY = mapsRef.current.getBoundingClientRect().bottom;
    if (mapsY < -1) {
      window.scrollTo(0, window.pageYOffset + mapsY - 20);
      collapseFooterSections();
      return;
    }
    const introY = introRef.current.getBoundingClientRect().bottom;
    if (introY < -1) {
      window.scrollTo(0, window.pageYOffset + introY + 1);
      return;
    }
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    document.onscroll = () => {
      if (mapsRef.current != null) {
        const height = mapsRef.current.getBoundingClientRect().bottom;
        if (height < window.innerHeight / 2) setShouldShowKnobs(false);
        else {
          setShouldShowKnobs(true);
        }
      }
      if (introRef.current != null) {
        const thresholdY = introRef.current.getBoundingClientRect().bottom - 10;
        if (thresholdY < 0) {
          setShowBackToTop(true);
        } else if (thresholdY > 0) {
          setShowBackToTop(false);
        }
      }
    };
  }, []);

  // JSX
  return (
    <div class={style.results}>
      <div
        class={style["back-to-top"]}
        onclick={handleBackToTopClick}
        style={
          showBackToTop
            ? "opacity: 1;"
            : "opacity: 0; pointer-events: none; cursor: default;"
        }
      >
        <Text id="results.back-to-top">Go up</Text> ⬆
      </div>
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
            In two of my recent exhibitions (Sobey Art Award Exhibition at the
            Art Gallery of Alberta, and “Positions” at Galerie Bradley
            Ertaskiran), I invited visitors to participate in a “Mapping
            Exercise” by taking a few minutes to fill a paper questionnaire
            comprising a variety of existential questions. Participants were
            asked to mark their position with a dot on a series of diagrams.
          </p>
          <h1>Results</h1>
          <p>
            In total, I received 1222 individual questionnaires. In the
            scatterplot graphs below, each dot corresponds to the answer of one
            participant. The questions appear exactly as on the original
            questionnaire.
          </p>
        </MarkupText>
        <p>
          <Text id="results.intro--link-p1">
            You will find more information under the graphs, at{" "}
          </Text>
          <a href="#null" onclick={handleToBottomClick}>
            <Text id="results.intro--link-p2">the bottom of the page</Text>
          </a>
          .
        </p>
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

          <aside class={style["empty-after"]}>
            <p>
              <strong>
                <Text id="results.footer.select">
                  Select & Follow Respondents
                </Text>
              </strong>
            </p>
            <p>
              <Text id="results.footer.select--body">
                You can draw a rectangle to select specific respondents and
                follow their answers from one graph to the next. (This function
                is not available on touchscreens.)
              </Text>
            </p>
            <img
              style="display: block; max-width: min(80vw, 400px); margin: 2rem auto 6rem;"
              src="../assets/transparency_select_blue.png"
              alt="an example of a mouse pointer selecting a rectangular section of points from a scatterplot"
            />
          </aside>
        </div>
      </div>
      <footer id="footer" ref={footerRef}>
        {/* COMMENTS */}
        <CollapsibleSection
          title={
            <Text id="results.footer.comments">
              Comments left by respondents
            </Text>
          }
          cb={() => toggleFooterSectionOpenClose(footerSection.COMMENTS)}
          isOpen={footerSectionIsOpen(footerSection.COMMENTS)}
          //collapseOverride={collapseOverride}
        >
          <MarkupText id="results.footer.comments--body">
            <p>
              A space at the end of the questionnaire allowed those who wanted
              to leave comments.
            </p>
            <p>
              About 10-15% of respondents left a comment. Here is a
              non-exhaustive list of comments received. The most repetitive
              comments ("very interesting," "congrats for the great show," etc.)
              have been removed.
            </p>
          </MarkupText>
          <h2>Edmonton:</h2>
          <table>
            <tr>
              <td>please love me</td>
            </tr>
            <tr>
              <td>Not sure "cosmological" was the right word.</td>
            </tr>
            <tr>
              <td>the human experiment</td>
            </tr>
            <tr>
              <td>CLIMATE CHANGE IS REAL</td>
            </tr>
            <tr>
              <td>ok boomer...</td>
            </tr>
            <tr>
              <td>looking forward to the results,</td>
            </tr>
            <tr>
              <td>beautiful show, very grounding</td>
            </tr>
            <tr>
              <td>thank you for asking these questions</td>
            </tr>
            <tr>
              <td>
                thank you for confronting us to our more realistic feeling &
                position about global issues
              </td>
            </tr>
            <tr>
              <td>keep playing</td>
            </tr>
            <tr>
              <td>&lt;3</td>
            </tr>
            <tr>
              <td>the axis is a western way of looking at the world</td>
            </tr>
            <tr>
              <td>
                purpose test see people background and how they feel about past
              </td>
            </tr>
            <tr>
              <td>you are wonderful love cherry pie</td>
            </tr>
            <tr>
              <td>you might find "factfulness" interesting</td>
            </tr>
            <tr>
              <td>its very relaxing to write with a pencil</td>
            </tr>
            <tr>
              <td>democracy is not = capitalism, this exercise is biased?</td>
            </tr>
            <tr>
              <td>first question makes me sad, life is so hard</td>
            </tr>
            <tr>
              <td>
                favorite part of the show, listened to the audio many times
              </td>
            </tr>
            <tr>
              <td>I'm 65 years old, age is relevant</td>
            </tr>
            <tr>
              <td>very confronting</td>
            </tr>
            <tr>
              <td>good initiative, would love to continue</td>
            </tr>
            <tr>
              <td>#bernie 2020</td>
            </tr>
            <tr>
              <td>a certain worldview / fun exercise</td>
            </tr>
            <tr>
              <td>
                egalitarian environmental passion aren't mutually inclusive
              </td>
            </tr>
            <tr>
              <td>Spectrum</td>
            </tr>
            <tr>
              <td>merci</td>
            </tr>
            <tr>
              <td>
                my 9 years ol daughter and i thought about the questions a lot
              </td>
            </tr>
            <tr>
              <td>
                the artist is not sociologist. your work is technically skilled
                but does not solve anything
              </td>
            </tr>
            <tr>
              <td>i struggle with the questions</td>
            </tr>
            <tr>
              <td>
                questions addressed were more relevant than I expected when done
              </td>
            </tr>
            <tr>
              <td>my info aggregated for external use</td>
            </tr>
            <tr>
              <td>
                super cool / question my values as a person and now society and
                the people
              </td>
            </tr>
            <tr>
              <td>interesting big picture exercise</td>
            </tr>
            <tr>
              <td>many supposed opposites in the questions</td>
            </tr>
            <tr>
              <td>exercise is interesting as per spatial reasoning</td>
            </tr>
            <tr>
              <td>made me question my life and my existence in my world</td>
            </tr>
            <tr>
              <td>some concepts are tough to represent with a small dot</td>
            </tr>
            <tr>
              <td>Feel fucking depressed after this</td>
            </tr>
            <tr>
              <td>great piece</td>
            </tr>
            <tr>
              <td>did i did it right?</td>
            </tr>
            <tr>
              <td>very thoughtful exercise</td>
            </tr>
            <tr>
              <td>
                ? on legitimacy because different meanings. interesting = thank
                you.
              </td>
            </tr>
            <tr>
              <td>took lots of effort, free labour.</td>
            </tr>
            <tr>
              <td>
                felt interesting to put emotions in grid, ppl do not understand
                issues of the world
              </td>
            </tr>
            <tr>
              <td>
                doing this was hard in the environment, overstimulating, good
                luck.
              </td>
            </tr>
            <tr>
              <td>i am new media..23yo...insecure future...</td>
            </tr>
            <tr>
              <td>
                thank you for sharing practice, exercise is curious compared to
                other exhibition.
              </td>
            </tr>
            <tr>
              <td>you blew my mind</td>
            </tr>
            <tr>
              <td>great exercise understand where we are as person-society.</td>
            </tr>
            <tr>
              <td>this art is sick</td>
            </tr>
            <tr>
              <td>joe mama</td>
            </tr>
            <tr>
              <td>great art-thought please notify me</td>
            </tr>
            <tr>
              <td>how did I read this ?!</td>
            </tr>
            <tr>
              <td>doesnt represent a wide demographic...</td>
            </tr>
            <tr>
              <td>doesnt represent whole society, interesting study.</td>
            </tr>
            <tr>
              <td>
                interesting, provoking, irrelevant, relevant, difficult exercise
              </td>
            </tr>
            <tr>
              <td>cant wait to cry in bed all night long</td>
            </tr>
            <tr>
              <td>what inspired you to make this art and this survey ?</td>
            </tr>
            <tr>
              <td>I really loved this</td>
            </tr>
            <tr>
              <td>fun exercise, chuckled out loud at last question.</td>
            </tr>
            <tr>
              <td>makes it less cold, great exhibition</td>
            </tr>
            <tr>
              <td>ne rigole pas, tres interessant et cool.</td>
            </tr>
            <tr>
              <td>i feel depressed</td>
            </tr>
            <tr>
              <td>deeply conflicted, question on my mind all the time...</td>
            </tr>
            <tr>
              <td>thought provoking exercise</td>
            </tr>
            <tr>
              <td>11 years old</td>
            </tr>
            <tr>
              <td>deeep questions</td>
            </tr>
            <tr>
              <td>good eye opener, seems longs</td>
            </tr>
            <tr>
              <td>existentialism, good</td>
            </tr>
            <tr>
              <td>
                thought provoking, would love to see what others have to sya
              </td>
            </tr>
            <tr>
              <td>this is brilliant you’re not alone</td>
            </tr>
            <tr>
              <td>makes me feel bad, collective achievement</td>
            </tr>
            <tr>
              <td>awesome, had fun</td>
            </tr>
            <tr>
              <td>some questions made me thin</td>
            </tr>
            <tr>
              <td>i like your art</td>
            </tr>
            <tr>
              <td>don't like quadrants, too scientific</td>
            </tr>
            <tr>
              <td>your paintings are meticulously crafted, waiting on news</td>
            </tr>
            <tr>
              <td>intrigued, pessimistic</td>
            </tr>
            <tr>
              <td>i appreciate provocation</td>
            </tr>
            <tr>
              <td>axis are too western specific</td>
            </tr>
            <tr>
              <td>makes me feel sad</td>
            </tr>
            <tr>
              <td>this was great and important</td>
            </tr>
            <tr>
              <td>suggestion: add grid</td>
            </tr>
            <tr>
              <td>Doesn’t feel like tangible and abstraction are opposite</td>
            </tr>
            <tr>
              <td>Don’t now difference between idealism and pragmatism</td>
            </tr>
            <tr>
              <td>almost uncomfortable with the broadness of thought</td>
            </tr>
            <tr>
              <td>
                made me thin, need to write about a piece for school project
              </td>
            </tr>
            <tr>
              <td>excited to see how it turned out</td>
            </tr>
            <tr>
              <td>seemed odd at first then I understood</td>
            </tr>
            <tr>
              <td>love amalgamation of tech+visuals</td>
            </tr>
            <tr>
              <td>super thought provoking</td>
            </tr>
            <tr>
              <td>i find that some axis are not opposites</td>
            </tr>
            <tr>
              <td>difficult and thought provoking</td>
            </tr>
            <tr>
              <td>don't understand a thing</td>
            </tr>
            <tr>
              <td>i am 54</td>
            </tr>
            <tr>
              <td>
                interactive art like this makes me question my own beliefs
              </td>
            </tr>
            <tr>
              <td>thanks, very relevant</td>
            </tr>
            <tr>
              <td>good for reflection, not for science</td>
            </tr>
            <tr>
              <td>very cool but very left thinking</td>
            </tr>
            <tr>
              <td>
                pple kept saying it was too much work, but i thin they're nuts.
                this is worth it
              </td>
            </tr>
            <tr>
              <td>i complete the exercise in the views of my lover</td>
            </tr>
            <tr>
              <td>question will be in my mind for awhile</td>
            </tr>
            <tr>
              <td>
                interview ai clever. exercise helped me thin about state of
                things
              </td>
            </tr>
            <tr>
              <td>question insightful, unique, fruitful discussion, thks</td>
            </tr>
            <tr>
              <td>
                hard question but important. is it better to be neutral or
                extreme?
              </td>
            </tr>
            <tr>
              <td>
                too uncomfortable to take a stand, wants to know more about
                study
              </td>
            </tr>
          </table>
          <h2>
            <Text id="results.footer.comments--montreal">Montreal</Text>:
          </h2>
          <table>
            <tr>
              <td>
                Certaines formulations dans les questions sont ambiguës, voire
                contradictoires. E.g. impact cosmologique de l'humanité
              </td>
            </tr>
            <tr>
              <td>
                It's too cold in here!! My friend made me leave cause she's
                going to catch a flu
              </td>
            </tr>
            <tr>
              <td>
                Lovely, thoughtful exercise. Have you read any James Bridle?
              </td>
            </tr>
            <tr>
              <td>
                Didn't expect to statuate on my world changing beliefs at an art
                expo. Good work!
              </td>
            </tr>
            <tr>
              <td>?</td>
            </tr>
            <tr>
              <td>Merci pour les réflexions posées par tes oeuvres.</td>
            </tr>
            <tr>
              <td>
                Expérience pertinente à la modernité. après on veut voir la
                cartographie!
              </td>
            </tr>
            <tr>
              <td>
                I found this an important exercise, making sense of what we
                think of each day but rarely put on paper.
              </td>
            </tr>
            <tr>
              <td>
                Like zenkoans they were unanswerable but nice to meditate on
              </td>
            </tr>
            <tr>
              <td>Génial, bravo :)</td>
            </tr>
            <tr>
              <td>
                à 20 ans on veut tout changer, à 40 ans on observe le
                changement, à 60 ans on se rend compte que rien ne change
                vraiment, à 80 ans mon futur est derrière moi - good luck
              </td>
            </tr>
            <tr>
              <td>L'important, c'est ça qui compte</td>
            </tr>
            <tr>
              <td>
                Your sample is biased and way too small. trying to find a trend
                in a biased and elitist circle only shows the emptiness of this
                form
              </td>
            </tr>
            <tr>
              <td>
                it was interesting to fill this out around other people, to see
                them thinking about their answers, erasing
              </td>
            </tr>
            <tr>
              <td>
                This was a welcome change from the usual gallery experience
              </td>
            </tr>
            <tr>
              <td>J'espère vraiment gagner!</td>
            </tr>
            <tr>
              <td>
                more questions, please... excellent work. keep up the
                research... and painting...
              </td>
            </tr>
            <tr>
              <td>
                Le dualisme cartésien est dépassé. Il faut s'ouvrir au monde
                quantique (les choix de réponse peuvent être à la fois vrai et
                faux selon les cas).
              </td>
            </tr>
            <tr>
              <td>Thanks for being thoughtful + encouraging us to think</td>
            </tr>
            <tr>
              <td>Merci pour l'expo. Questionnaire cool. À bientôt.</td>
            </tr>
            <tr>
              <td>certaines questions m'ont embêtées... c'était difficile!</td>
            </tr>
            <tr>
              <td>
                Data has the answers, it knows me better than I will ever know
                myself. Congrats on this amazing show my friend
              </td>
            </tr>
            <tr>
              <td>
                Bonne idée! J'ai hâte de voir la publication. Ces questions font
                réfléchir
              </td>
            </tr>
            <tr>
              <td>
                it was difficult to answer honestly. most questions are things I
                would need more time to think about... they really ask you to
                dig deep
              </td>
            </tr>
            <tr>
              <td>
                Je devine une fois encore, que je ne suis que tout noir ou tout
                blanc. Est-ce que le monde est une zone grise, et je suis en
                dehors?
              </td>
            </tr>
            <tr>
              <td>
                It feels most of the questions/statements tend to push me think
                about those issues in rather binary point of view; I do
                understand this kind of mapping/survey exercise has to be
                polarized for its better & easier efficiency, but I've found
                some difficult to 'position' myself
              </td>
            </tr>
            <tr>
              <td>
                I am having similar thoughts on technology and what it is truly
                doing to society, to our communities and our basic needs for
                connections and family
              </td>
            </tr>
            <tr>
              <td>wonderful, inspiring.. thank you!</td>
            </tr>
            <tr>
              <td>
                Je me sentais observé par moi-même. je ne suis pas certain
                d'avoir été 100% honnête peut-être 50-60% 70%
              </td>
            </tr>
            <tr>
              <td>
                vraiment intéressant de se questionner dans le cadre de
                l'exposition. sets the mood & tone
              </td>
            </tr>
            <tr>
              <td>
                Parfois, il faut ??? une chose et une autre et son opposé pour
                avancer
              </td>
            </tr>
            <tr>
              <td>
                Congrats great show ps I like the exercise but I keep wanting to
                3D it...
              </td>
            </tr>
            <tr>
              <td>
                This has been a great exercise. The diagram, once I became
                comfortable with it did assist me in considering how it was that
                I actually felt. I wonder how it would look if I were to do it a
                second time. Thank you. I loved it
              </td>
            </tr>
            <tr>
              <td>difficile de se positionner sans chiffres</td>
            </tr>
            <tr>
              <td>difficile de se positionner exactement, enjeux compexes</td>
            </tr>
            <tr>
              <td>merci pour la reflexion</td>
            </tr>
            <tr>
              <td>jai 31 ans</td>
            </tr>
            <tr>
              <td>bonjour j’aime beaucoup</td>
            </tr>
            <tr>
              <td>as an artist i did this for you, but basically wtf?</td>
            </tr>
            <tr>
              <td>
                le monde liberté economique est different de la liberte
                artistique + poeme
              </td>
            </tr>
            <tr>
              <td>when we will be able to live as one...</td>
            </tr>
            <tr>
              <td>strong magnetic reaction to the exhibition</td>
            </tr>
            <tr>
              <td>nice stepback from chaotic world</td>
            </tr>
            <tr>
              <td>question well thought, age is irelevant</td>
            </tr>
            <tr>
              <td>very engaging</td>
            </tr>
            <tr>
              <td>accuracy of responses will shift</td>
            </tr>
            <tr>
              <td>intéressant et pertinent - perception artiste</td>
            </tr>
            <tr>
              <td>J’ai passé un très bon moement</td>
            </tr>
            <tr>
              <td>ensemble nous vaincrons le futur</td>
            </tr>
          </table>
        </CollapsibleSection>

        {/* ANALYSIS */}
        <CollapsibleSection
          title={<Text id="results.footer.analysis">Analysis</Text>}
          cb={() => toggleFooterSectionOpenClose(footerSection.ANALYSIS)}
          isOpen={footerSectionIsOpen(footerSection.ANALYSIS)}
        >
          <MarkupText id="results.footer.analysis--body">
            <p>
              (Data analysis by Group Leger Analytics, with further
              interpretation and comments by Nicolas Grenier.)
            </p>
            <h2>PART I - YOU</h2>
            <h3>Graph 1</h3>
            <ul>
              <li>
                <strong>
                  Most respondents situate themselves in the first half of their
                  life and find it rather “easy to exist in this world.”
                </strong>
              </li>
              <li>
                Overall, about a third (360 respondents, or 32%) find it rather
                “hard to exist in this world.”
              </li>
            </ul>

            <h3>Graph 2</h3>
            <ul>
              <li>
                <strong>The vast majority of respondents</strong> (782
                individuals, or 66%){" "}
                <strong>
                  want their life to have greater meaning beyond their small
                  existence.{" "}
                </strong>
                Among these, a majority believes that morality and social norms
                are human universals.
              </li>
              <li>
                However,
                <strong>
                  {" "}
                  there is no overall consensus as to whether morality is
                  universal or cultural.{" "}
                </strong>
                Slightly more respondents (535, or 45%) believe that morality is
                subjective and cultural rather than human universals (486, or
                41%), and a significant proportion are neutral or ambivalent
                (146, or 13%).
              </li>
            </ul>
            <h2>PART II - YOU AND THE WORLD</h2>
            <h3>Graph 3</h3>
            <ul>
              <li>
                There is a strong concentration in the top right quadrant, where
                <strong>a majority of respondents</strong> (657, or 56%)
                <strong>
                  {" "}
                  indicate that they both feel a deep connexion to the land and
                  keep moving far and wide.
                </strong>
              </li>
            </ul>
            <h3>Graph 4</h3>
            <ul>
              <li>
                <strong>A clear majority of respondents</strong> (665, or 57%)
                <strong>
                  {" "}
                  does not accept the legitimacy of the current world order.
                </strong>{" "}
                Among these, most respondents (371) indicate that they care more
                about larger questions and abstractions than the tangible
                reality of life.
              </li>
              <li>
                Overall, answers are scattered on all quadrants, and a large
                proportion (332, or 28%) is neutral or ambivalent when given the
                choice between caring more about the “tangible reality of life”
                or “larger questions and abstractions.”
              </li>
            </ul>
            <h3>Graph 5</h3>
            <ul>
              <li>
                <strong>There is almost complete unanimity</strong> (1049
                respondents, or 92%):
                <strong>
                  {" "}
                  exposure to different beliefs and value systems leads to
                  increased tolerance and mutual understanding.
                </strong>
              </li>
              <li>
                A majority of respondents (589 or 51%) indicate that they define
                themselves and their convictions on their own, but many also
                define themselves in relation to groups with whom they belong
                (380, or 33%) and a good proportion is neutral or ambivalent
                (182, or 16%).
              </li>
            </ul>
            <h2>PART III - YOU AND THE FUTURE</h2>
            <h3>Graph 6</h3>
            <ul>
              <li>
                <strong>There is a very strong consensus</strong> (938
                respondents, or 83%)
                <strong>
                  {" "}
                  that we, humans living today, will have an impact of
                  cosmological importance for the future of humanity.
                </strong>
              </li>
              <li>
                <strong>A strong majority</strong> (653 respondents, or 57%)
                <strong>
                  {" "}
                  believes that “we’re going toward self-destruction,”
                </strong>{" "}
                while a small minority (266, or 23%) believes that we’re making
                constant progress, and almost as many (223, or 20%) are neutral
                or ambivalent.
              </li>
            </ul>
            <h3>Graph 7</h3>
            <ul>
              <li>
                <strong>A strong majority</strong> (847 respondents, or 75%)
                <strong>
                  {" "}
                  wants to protect the planet and reinvent a more egalitarian
                  world
                </strong>
                , and within this majority most respondents
                <strong>
                  {" "}
                  are willing to dedicate themselves to the cause.{" "}
                </strong>
              </li>
              <li>
                By contrast, a tiny minority affirms being strongly committed to
                defending “private property, the free market economy, and the
                freedom of the individual” (70 respondents or 6%). A more
                significant proportion is neutral or ambivalent (161
                respondents, or 15%).
              </li>
            </ul>
            <h3>Graph 8</h3>
            <ul>
              <li>
                <strong>
                  {" "}
                  Answers are scattered across all four quadrants.{" "}
                </strong>
              </li>
              <li>
                <strong>A small majority of people</strong> (586 respondents, or
                51%)
                <strong>
                  {" "}
                  feel that they have the power to change things on a structural
                  level
                </strong>
                , while about one third feels powerless (386, or 34%).
              </li>
              <li>
                A small majority believes that idealism is more important than
                pragmatism, and a third of all respondents (351, or 31%) are
                neutral or ambivalent.
              </li>
            </ul>
            <h2>YOU AND THIS EXERCISE</h2>
            <h3>Graph 9</h3>
            <ul>
              <li>
                Thankfully,
                <strong> there is a strong consensus among respondents </strong>
                (871, or 76%):
                <strong>
                  they estimate that the questions were well-balanced and
                  relevant, and that their answers truly represent how they
                  feel.
                </strong>
              </li>
              <li>
                A small proportion of respondents (100, or 8%) consider the
                questions rather biased and / or moralizing and / or annoying.
              </li>
              <li>
                A tiny proportion affirms that their answers to the
                questionnaire are rather meaningless (19 respondents, or less
                than 2%).
              </li>
            </ul>
          </MarkupText>
        </CollapsibleSection>
        {/* CONSIDERATIONS */}
        <CollapsibleSection
          title={<Text id="results.footer.considerations">Considerations</Text>}
          cb={() => toggleFooterSectionOpenClose(footerSection.CONSIDERATIONS)}
          isOpen={footerSectionIsOpen(footerSection.CONSIDERATIONS)}
        >
          <MarkupText id="results.footer.considerations--body">
            <h2>Extras: drawings, lines and other</h2>
            <p>
              About 5-10% of the questionnaires included marks other than dots.
              Unfortunately, due to the most boring pragmatic limitations (time
              and budget), it is impossible to reproduce all of this here.
            </p>
            <p>
              In the majority of cases, the marks consist in one or more
              additional dots, one or several lines, or a shape enclosing an
              area of a graph. Sometimes (in about 1 or 2% of cases), it is a
              drawing or an inscription. Usually, when possible, we simply
              considered the location of these marks on the graph as if it was a
              dot.
            </p>
            <p>
              In almost all cases, these marks express a clear desire not to be
              limited to Cartesian logic and to a single response — which of
              course can be reductive. This critique comes up in the comments as
              well.
            </p>
            <h2>Why are there so many dots in the center?</h2>
            <p>
              On average, 5.5% of all answers are found at the center of the
              graphs (it oscillates between 3% and 11% from one graph to the
              next), which is not as much as it may seem. Still, it remains
              significant.
            </p>
            <p>
              Given the X/Y-axis structure of the graphs and the existential
              nature of the questions, the center was probably used as the
              default position whenever someone wanted to express neutrality
              and/or ambivalence, and/or the actual position where respondents
              see themselves, and/or a way to express “none of the above” or
              “all of the above.” (Among the respondents who left comments in
              the questionnaire, several wrote that only one dot could not
              adequately express their position.)
            </p>
            <h2>Respondent categories</h2>
            <p>
              <strong>
                This analysis considers all respondents together.{" "}
              </strong>
              Overall, there are no major differences between the responses of
              the populations of Montreal and Edmonton, nor between Francophones
              and Anglophones. However, to compare the different categories of
              respondents (Edmonton or Montreal, questionnaires in French or in
              English), go to “Visualization options,” click “Show respondents
              from…” and pick the groups you want. In “Graph type” you can
              select percentage to make it easier to compare.
            </p>
            <p>
              The respondents are museum and gallery goers, and as such are not
              necessarily representative of the general population.
            </p>
            <h2>Dates</h2>
            <p>
              It must be noted that the last questionnaires were handed on March
              7, 2020, just one week before the pandemic changed our lives. (How
              different would the answers be if the survey was to be conducted
              today? Given the nature of the questionnaire, would the pandemic
              be more of a distraction, or would it fundamentally alter how
              people think about those issues?)
            </p>
            <h2>Representation of the dots</h2>
            <p>
              In order to better show each individual dot on the scatterplot
              graphs, an algorithm was applied to slightly separate the dots
              from one another. (For example, if 35 respondents placed a dot
              exactly in the center, these dots are here presented not as a
              single dot but as a cluster of dots.)
            </p>
            <h2>Beware of numbers</h2>
            <p>
              The raison d'être of this questionnaire is above all to exist
              visually, and to question the way in which we consider issues of a
              qualitative nature. We live in a data-driven world, and numbers
              are often used to create a sense of knowledge, expertise, and
              predictability that hides the fundamental and radical uncertainty
              that defines the human condition. Here, we tried to balance the
              use of numbers and visuals to give you the best possible portrait
              of the results. But numbers can only give you the simplified
              portrait; always refer to the scatterplot graphs to interpret the
              numbers.
            </p>
          </MarkupText>
        </CollapsibleSection>
        {/* ABOUT */}
        <CollapsibleSection
          title={<Text id="results.footer.about">About this project</Text>}
          cb={() => toggleFooterSectionOpenClose(footerSection.ABOUT)}
          isOpen={footerSectionIsOpen(footerSection.ABOUT)}
        >
          <MarkupText id="results.footer.about--body">
            <p>
              This questionnaire was designed as part of my installation for the
              Sobey Art Award Exhibition, which took place at the Art Gallery of
              Alberta, Edmonton, Canada from October 5, 2019 to January 5, 2020.
            </p>
            <p>
              The diagrammatic structure of the questionnaire mirrors some of my
              paintings. I wanted to create an experience in which visitors
              could immerse themselves in the works not only by looking, but
              also by positioning themselves in relation to the same existential
              issues that I address in my work. Taking position involves
              choosing this over that, which is to say, it involves a form of
              measurement. But a quantitative framework is inherently
              inappropriate to consider qualitative notions such as morality or
              progress. So I deliberately avoided presenting participants with
              precise grids, numbers and metrics. I didn’t want the focus to be
              on quantification, but on navigation — I wanted participants to
              navigate through different sets of issues put in relation with one
              another and find their own position as intuitively as possible. To
              make visitors engage in this experience was the essence of the
              project.
            </p>
            <p>
              During the Sobey Art Award exhibition, 941 visitors took the time
              to fill a questionnaire — much more than I expected. I often
              witnessed people spending several minutes pondering the questions,
              and many left positive feedback on the questionnaire.
            </p>
            <p>
              So I decided to integrate the same questionnaire in my next
              exhibition, “Positions,” which took place in the Bunker at Galerie
              Bradley Ertaskiran, Montreal, from January 24 to March 7, 2020. We
              collected a total of 281 questionnaires, much more than I expected
              for a private gallery exhibition.
            </p>
            <p>
              1222 individual questionnaires were collected during the two
              exhibitions.
            </p>
            <p>
              It took one year to secure funding, compile the data, analyze the
              results, and build this interface.
            </p>
          </MarkupText>
        </CollapsibleSection>
        <section class={style.acknowledgements}>
          <h1 lang="en">
            <Text id="results.footer.acknowledgements">
              Acknowledge&shy;ments
            </Text>
          </h1>
          <MarkupText id="results.footer.acknowledgements--body">
            <p>
              The questionnaire was conceived with help from
              <strong> Tyson Atkings, David Elliott</strong>, and
              <strong> Chantal Gevrey</strong>.
            </p>
            <p>
              The paper questionnaires were collected by the team at the
              <strong> Art Gallery of Alberta</strong> (thanks to curator
              <strong> Lindsey Sharman</strong>) and by the team at
              <strong> Galerie Bradley Ertaskiran</strong> (thanks to
              <strong> Soad Carrier</strong>, <strong> Cécile Bertévas</strong>,
              <strong> Mark Lowe</strong> and <strong> Russell Banx</strong>).
            </p>
            <p>
              Data from the paper questionnaires were compiled by
              <strong> Loucas Braconnier</strong>, with help from
              <strong> William Sabourin</strong>, <strong> Sarah Boutin</strong>
              , and
              <strong> Mathieu Reed</strong>.
            </p>
            <p>
              The data analysis was conducted by <strong> Bich Tran</strong> and
              <strong> Amélie Bériault-Poirier</strong> from
              <strong> Group Leger Analytics</strong>.
            </p>
            <p>
              This interface for data visualisation was built by
              <strong>
                {" "}
                <a
                  style="background: inherit; color: inherit;"
                  href="https://nilueps.net"
                >
                  Nicolas&nbsp;Epstein
                </a>
              </strong>
              .
            </p>
            <h1 style="margin-top: 3rem;">
              The project was made possible thanks to the support of:
            </h1>
          </MarkupText>
          <img
            src="../assets/logo-conseil-des-arts-du-canada.png"
            alt="logo of the canada council for the arts"
          />
          <img
            src="../assets/national-gallery-of-canada-logo-vector.png"
            alt="logo of the national art gallery of canada"
          />
          <img
            src="../assets/AGA_BW_Vrt.jpg"
            alt="logo of the art gallery of alberta"
          />
          <img
            src="../assets/hero-text-sobeys-en_0.png"
            alt="logo of the sobey art award"
          />
        </section>
      </footer>
    </div>
  );
}
