import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    displayName : Text;
    bio : Text;
    socialLinks : [Text];
    visibility : { #publicVisibility; #privateVisibility };
    activityInterests : Text;
    skills : Text;
    currentProjects : Text;
    programmingLanguages : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    chatMessages : Map.Map<Nat, { id : Nat; author : Principal; content : Text; timestamp : Int }>;
    nextMessageId : Nat;
  };

  type NewUserProfile = {
    displayName : Text;
    bio : Text;
    socialLinks : [Text];
    visibility : { #publicVisibility; #privateVisibility };
    activityInterests : Text;
    skills : Text;
    currentProjects : Text;
    programmingLanguages : Text;
    number : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    chatMessages : Map.Map<Nat, { id : Nat; author : Principal; content : Text; timestamp : Int }>;
    nextMessageId : Nat;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        { oldProfile with number = "" }; // Default old profiles without number to empty string.
      }
    );
    {
      old with
      userProfiles = newUserProfiles
    };
  };
};
