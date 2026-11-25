export type MascotPose="wave"|"book"|"listen"|"success";

const poseDescriptions:Readonly<Record<MascotPose,string>>={
 wave:"Strudli waving hello",
 book:"Strudli reading an A1 German book",
 listen:"Strudli wearing headphones",
 success:"Strudli celebrating with a thumbs-up"
};

/** Four poses are extracted from the user's approved 22 Nov 2026 Strudli brand sheet.
 * The self-hosted four-frame PNG is cropped artwork, not a new generated mascot.
 * No movement is embedded in the sprite; CSS respects reduced-motion preferences.
 */
export default function StrudliMascot({pose}:{pose:MascotPose}){
 return <div className={"strudliMascot strudliMascot--"+pose} aria-label={poseDescriptions[pose]} role="img">
   <span className="strudliMascotSprite" aria-hidden="true"/>
 </div>;
}
