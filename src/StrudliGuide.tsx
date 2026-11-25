import type {UILang} from "./i18n";
import "./strudli-guide.css";

type Props={
 language:UILang;
 message:string;
 tone?:"neutral"|"success"|"hint";
 compact?:boolean;
 className?:string;
};

/** A quiet, reusable Strudli guide; never covers answers or plays unsolicited audio. */
export default function StrudliGuide({language,message,tone="neutral",compact=false,className=""}:Props){
 return <aside className={["strudliGuide","strudliGuide--"+tone,compact?"strudliGuide--compact":"",className].filter(Boolean).join(" ")} aria-label={language==="uk"?"Підказка Strudli":"Tip from Strudli"}>
  <img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true" loading="lazy"/>
  <div className="strudliGuideSpeech">
   <strong>Strudli</strong>
   <p>{message}</p>
  </div>
 </aside>;
}
