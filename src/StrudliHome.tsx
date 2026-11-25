import {ArrowRight, House, MapPin, Utensils, TramFront, ShoppingBag, UsersRound, Stethoscope, Leaf, GraduationCap, Sun, MessagesSquare} from "lucide-react";
/* The hero uses a sharpened standalone SVG of the exact approved Strudli pose. */
import {DEMO_WORDS} from "./data";
import type {LearningSection} from "./learningSections";
import type {ReactNode} from "react";
import {sectionLabel,type UILang} from "./i18n";
import "./strudli-home.css";
import "./strudli-approved.css";
import "./strudli-stage13.css";
import "./strudli-cover-loading.css";

type Props={
 language:UILang;
 sections:LearningSection[];
 onContinue:()=>void;
 onMeetStrudli:()=>void;
 onWords:()=>void;
 onReading:()=>void;
 onSentences:()=>void;
 onFavorites:()=>void;
 onSection:(section:LearningSection)=>void;
 onStory:(id:string)=>void;
 onAsk:()=>void;
};
const topicPhotos:Readonly<Record<string,string>>={
 food:"/strudli/topic-food-breakfast.jpg",
 home:"/strudli/topic-home-livingroom.jpg",
 nature:"/strudli/topic-nature-dog.jpg",
 health:"/strudli/topic-health-doctor.jpg",
 daily:"/strudli/topic-daily-routine.jpg"
};
const coverFallbacks:Readonly<Record<string,string>>={
 food:"/obst-fruit-basket-approved.avif",
 home:"/photos/approved/everyday-54.webp",
 nature:"/photos/custom/batch26-nature-505.jpg",
 health:"/photos/custom/batch28-body-691.jpg",
 daily:"/photos/approved/everyday-53.webp",
 city:"/photos/custom/batch26-city-538.jpg",
 study:"/photos/custom/batch27-study-633.jpg"
};
const topicIcons:Record<string,ReactNode>={food:<Utensils/>,home:<House/>,city:<TramFront/>,services:<ShoppingBag/>,people:<UsersRound/>,health:<Stethoscope/>,nature:<Leaf/>,study:<GraduationCap/>,daily:<Sun/>,language:<MessagesSquare/>};
export default function StrudliHome({language,sections,onContinue,onMeetStrudli,onWords,onReading,onSentences,onFavorites,onSection,onStory,onAsk}:Props){
 const en=language==="en";
 return <div className="strudliLanding">
  <section className={"strudliLandingHero"+(en?" strudliLandingHero--en":" strudliLandingHero--uk")} aria-label={en?"Welcome to Strudli Lernen":"Ласкаво просимо до Strudli Lernen"}>
   <div className="strudliLandingScene" aria-hidden="true"/>
   <button type="button" className="strudliLandingMascot strudliTourLaunch" onClick={onMeetStrudli} aria-label={en?"Meet Strudli and tour the app":"Познайомитися зі Strudli та застосунком"}><img className="strudliLandingMascotHQ" src="/strudli/strudli-storybook-hero.webp" onError={e=>{if(!e.currentTarget.src.endsWith("/strudli/strudli-hero-sharp.svg"))e.currentTarget.src="/strudli/strudli-hero-sharp.svg"}} alt="" aria-hidden="true" loading="eager" decoding="async"/></button>
   <div className="strudliLandingWelcome">
    <div className="strudliLandingBubble">
     <h1>{en?"Learn German":"Вивчай німецьку"}<span>{en?"with joy.":"із задоволенням."}</span></h1>
     <p>{en?"Strudli will help you take the next step.":"Strudli допоможе зробити наступний крок."}</p>
     <span aria-hidden="true" className="strudliHeart">♡</span>
    </div>
   </div>
    <button className="strudliLandingContinue" onClick={onContinue}><img className="strudliLandingCtaIcon" src="/strudli/icon-reading.svg" alt="" aria-hidden="true"/><span>{en?"Continue learning":"Продовжити навчання"}</span><ArrowRight size={28}/></button>
  </section>
  <nav className="strudliLandingFeatures" aria-label={en?"Learning activities":"Способи навчання"}>
   <button onClick={onWords}><img className="strudliBookIcon" src="/strudli/icon-books.svg" alt="" aria-hidden="true"/><strong>{en?"Dictionary":"Словник"}</strong></button>
   <button onClick={onReading}><img className="strudliBookIcon" src="/strudli/icon-reading.svg" alt="" aria-hidden="true"/><strong>{en?"Stories":"Історії"}</strong></button>
   <button onClick={onSentences}><img className="strudliBookIcon" src="/strudli/icon-sentences.svg" alt="" aria-hidden="true"/><strong>{en?"Sentences":"Речення"}</strong></button>
   <button onClick={onFavorites}><img className="strudliBookIcon" src="/strudli/icon-heart.svg" alt="" aria-hidden="true"/><strong>{en?"Favorites":"Обране"}</strong></button>
  </nav>
  <section className="strudliSpotlights" aria-label={en?"Featured":"Головне"}>
   <button type="button" className="strudliSpotlight strudliSpotlight--story" onClick={()=>onStory("bremen")}>
    <img src="/lesen-pilot/stories/bremen/media/raeuber.webp" alt="" aria-hidden="true" loading="lazy" decoding="async"/>
    <span className="strudliSpotlightBody"><span className="strudliSpotlightTag">{en?"CINEMA TALE · A1/A2":"КІНОКАЗКА · A1/A2"}</span><strong lang="de">Die Bremer Stadtmusikanten</strong><small>{en?"Watch, listen and tap any word. 3 episodes.":"Дивись, слухай і натискай на слова. 3 серії."}</small></span>
    <ArrowRight size={22} aria-hidden="true"/>
   </button>
   <button type="button" className="strudliSpotlight strudliSpotlight--ask" onClick={onAsk}>
    <img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true" loading="lazy" decoding="async"/>
    <span className="strudliSpotlightBody"><span className="strudliSpotlightTag">AI</span><strong>{en?"Ask Strudli":"Запитай Strudli"}</strong><small>{en?"Paste a German sentence from a letter — get it explained in English.":"Встав німецьке речення з листа — Strudli пояснить українською."}</small></span>
    <ArrowRight size={22} aria-hidden="true"/>
   </button>
  </section>
  <section className="strudliLandingTopics" aria-labelledby="strudli-topics-heading">
   <h2 id="strudli-topics-heading"><MapPin aria-hidden="true"/><span>{en?"Choose a topic":"Обери тему"}</span></h2>
   <div className="strudliLandingTopicGrid">
    {sections.map((section,index)=>{
     const cover=topicPhotos[section.id]||section.coverPhoto||(section.coverWordId?DEMO_WORDS.find(word=>word.id===section.coverWordId)?.photo:undefined);
     const fallback=coverFallbacks[section.id];
     return <button className="strudliLandingTopicCard" key={section.id} data-section={section.id} onClick={()=>onSection(section)}>
      {cover&&<img className="strudliLandingTopicCover" src={cover} alt="" aria-hidden="true" loading={index<2?"eager":"lazy"} fetchPriority={index<2?"high":"auto"} decoding="async"
       onLoad={e=>e.currentTarget.classList.add("isLoaded")}
       onError={e=>{const img=e.currentTarget;if(fallback&&img.getAttribute("src")!==fallback){img.src=fallback}else{img.style.display="none"}}}/>}
      <span className="strudliLandingTopicPlaceholder" aria-hidden="true">{topicIcons[section.id]}</span>
      <span className="strudliLandingTopicShade" aria-hidden="true"/>
      <span className="strudliLandingTopicName"><span className="strudliLandingTopicIcon" aria-hidden="true">{topicIcons[section.id]}</span><strong>{sectionLabel(section.id,section.name,language)}</strong></span>
      <span className="strudliLandingTopicArrow" aria-hidden="true"><ArrowRight size={24}/></span>
     </button>;
    })}
   </div>
  </section>
 </div>;
}
