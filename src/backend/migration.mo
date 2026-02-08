import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old actor type WITHOUT persistent accessControlState
  type OldActor = {
    userProfiles : Map.Map<Principal, {
      displayName : Text;
      bio : Text;
      socialLinks : [Text];
      visibility : {
        #publicVisibility;
        #privateVisibility;
      };
      activityInterests : Text;
      skills : Text;
      currentProjects : Text;
      programmingLanguages : Text;
      number : Text;
    }>;
    chatMessages : Map.Map<Nat, {
      id : Nat;
      author : Principal;
      content : Text;
      timestamp : Int;
    }>;
    nextMessageId : Nat;
    // verifiedUsers does not exist in old version
  };

  // New actor type with persistent `verifiedUsers`
  type NewActor = {
    userProfiles : Map.Map<Principal, {
      displayName : Text;
      bio : Text;
      socialLinks : [Text];
      visibility : {
        #publicVisibility;
        #privateVisibility;
      };
      activityInterests : Text;
      skills : Text;
      currentProjects : Text;
      programmingLanguages : Text;
      number : Text;
    }>;
    chatMessages : Map.Map<Nat, {
      id : Nat;
      author : Principal;
      content : Text;
      timestamp : Int;
    }>;
    nextMessageId : Nat;
    verifiedUsers : Map.Map<Principal, Bool>;
  };

  public func run(old : OldActor) : NewActor {
    let verifiedUsers = Map.empty<Principal, Bool>(); // start empty
    { old with verifiedUsers };
  };
};
