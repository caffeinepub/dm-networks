import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

import AccessControl "authorization/access-control";

// Data migration support for persistent `verifiedUsers` map
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ProfileVisibility = {
    #publicVisibility;
    #privateVisibility;
  };

  public type SerializableUserProfile = {
    displayName : Text;
    bio : Text;
    socialLinks : [Text];
    visibility : ProfileVisibility;
    activityInterests : Text;
    skills : Text;
    currentProjects : Text;
    programmingLanguages : Text;
    number : Text;
  };

  public type PublicProfile = {
    principal : Principal;
    profile : SerializableUserProfile;
    isVerified : Bool;
  };

  public type ChatMessage = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Int;
  };

  let userProfiles = Map.empty<Principal, SerializableUserProfile>();
  let verifiedUsers = Map.empty<Principal, Bool>();

  var chatMessages = Map.empty<Nat, ChatMessage>();
  var nextMessageId = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?SerializableUserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?SerializableUserProfile {
    let callerRole = AccessControl.getUserRole(accessControlState, caller);
    switch (callerRole) {
      case (#user or #admin) {};
      case (#guest) { Runtime.trap("Unauthorized: Only users can view profiles") };
    };

    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) {
        // Owner or admin can see full profile
        if (caller == user or AccessControl.isAdmin(accessControlState, caller)) {
          ?profile;
        } else if (profile.visibility == #publicVisibility) {
          // Public profiles are fully visible
          ?profile;
        } else {
          // Private profiles: return only basic information, hide visibility setting and number
          ?{
            displayName = profile.displayName;
            bio = profile.bio;
            socialLinks = profile.socialLinks;
            visibility = #publicVisibility; // Don't leak privacy preference
            activityInterests = "";
            skills = "";
            currentProjects = "";
            programmingLanguages = "";
            number = ""; // Always clear number for non-owners
          };
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : SerializableUserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createChatMessage(content : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can post messages");
    };
    let messageId = nextMessageId;
    let newMessage : ChatMessage = {
      id = messageId;
      author = caller;
      content;
      timestamp = Time.now();
    };
    chatMessages.add(messageId, newMessage);
    nextMessageId += 1;
    messageId;
  };

  public query ({ caller }) func getChatMessages() : async [ChatMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view chat messages");
    };
    chatMessages.values().toArray();
  };

  public shared ({ caller }) func deleteChatMessage(messageId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete messages");
    };

    let existed = chatMessages.containsKey(messageId);
    chatMessages.remove(messageId);

    if (not existed) {
      Runtime.trap("Message not found");
    };
  };

  public query ({ caller }) func getMemberDirectory() : async [PublicProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access member directory");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    userProfiles.entries().toArray().map(
      func((principal, profile)) : PublicProfile {
        // Owner or admin sees full profile
        let hasVerifiedBadge = verifiedUsers.get(principal) == ?true;
        if (principal == caller or isAdmin) {
          { principal; profile; isVerified = hasVerifiedBadge };
        } else if (profile.visibility == #publicVisibility) {
          // Public profiles are fully visible
          { principal; profile; isVerified = hasVerifiedBadge };
        } else {
          // Private profiles: show only basic information and exclude number
          {
            principal;
            profile = {
              displayName = profile.displayName;
              bio = profile.bio;
              socialLinks = profile.socialLinks;
              visibility = #publicVisibility;
              activityInterests = "";
              skills = "";
              currentProjects = "";
              programmingLanguages = "";
              number = "";
            };
            isVerified = hasVerifiedBadge;
          };
        };
      }
    );
  };

  public shared ({ caller }) func toggleVerifiedBadge(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign verified badges");
    };

    let currentlyVerified = switch (verifiedUsers.get(user)) {
      case (null) { false };
      case (?value) { value };
    };

    let newVerificationStatus = not currentlyVerified;
    verifiedUsers.add(user, newVerificationStatus);
  };

  public query ({ caller }) func isUserVerified(user : Principal) : async Bool {
    switch (verifiedUsers.get(user)) {
      case (null) { false };
      case (?value) { value };
    };
  };
};
