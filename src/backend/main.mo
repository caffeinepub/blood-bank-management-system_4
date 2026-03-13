import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Int "mo:core/Int";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type UserProfile = {
    id : Principal;
    name : Text;
    email : ?Text;
    timeCreated : Time.Time;
  };

  public type Donor = {
    id : Principal;
    name : Text;
    bloodGroup : Text;
    age : Nat;
    contact : Text;
    lastDonationDate : Time.Time;
  };

  public type BloodStock = {
    bloodGroup : Text;
    unitsAvailable : Nat;
  };

  public type Request = {
    id : Nat;
    user : Principal;
    bloodGroup : Text;
    units : Nat;
    status : {
      #pending;
      #approved;
      #rejected;
    };
    requestDate : Time.Time;
  };

  // State
  let users = Map.empty<Principal, UserProfile>();
  let donors = Map.empty<Principal, Donor>();
  let bloodStock = Map.empty<Text, BloodStock>();
  let requests = Map.empty<Nat, Request>();
  var nextRequestId = 1;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module BloodStock {
    public func compareByBloodGroup(stock1 : BloodStock, stock2 : BloodStock) : Order.Order {
      Text.compare(stock1.bloodGroup, stock2.bloodGroup);
    };
  };

  module Request {
    public func compareByRequestDate(req1 : Request, req2 : Request) : Order.Order {
      Int.compare(req1.requestDate, req2.requestDate);
    };
  };

  // Initialize sample data
  public shared ({ caller }) func initSampleData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let sampleDonors = List.empty<(Principal, Donor)>();

    let d1 : Donor = {
      id = Principal.fromText("aaaaa-aa");
      name = "John Doe";
      bloodGroup = "A+";
      age = 30;
      contact = "1234567890";
      lastDonationDate = Time.now();
    };

    let d2 : Donor = {
      id = Principal.fromText("bbbbb-bb");
      name = "Jane Smith";
      bloodGroup = "B-";
      age = 25;
      contact = "9876543210";
      lastDonationDate = Time.now();
    };

    sampleDonors.add((d1.id, d1));
    sampleDonors.add((d2.id, d2));

    donors.clear();
    let sampleDonorsIter = sampleDonors.values();
    for ((id, d) in sampleDonorsIter) {
      donors.add(id, d);
    };

    let stockData : [(Text, BloodStock)] = [
      ("A+", { bloodGroup = "A+"; unitsAvailable = 10 }),
      ("B-", { bloodGroup = "B-"; unitsAvailable = 5 }),
    ];
    bloodStock.clear();
    for ((k, v) in stockData.values()) {
      bloodStock.add(k, v);
    };
  };

  // Donor CRUD (Admin-only)
  public shared ({ caller }) func addDonor(donor : Donor) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add donors");
    };
    donors.add(donor.id, donor);
  };

  public query ({ caller }) func getDonor(id : Principal) : async ?Donor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view donor details");
    };
    donors.get(id);
  };

  public query ({ caller }) func getAllDonors() : async [Donor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all donors");
    };
    donors.values().toArray();
  };

  // BloodStock CRUD
  public shared ({ caller }) func updateBloodStock(stock : BloodStock) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blood stock");
    };
    bloodStock.add(stock.bloodGroup, stock);
  };

  // Public read access to blood stock for users to view availability
  public query ({ caller }) func getBloodStock(bloodGroup : Text) : async ?BloodStock {
    bloodStock.get(bloodGroup);
  };

  public query ({ caller }) func getAllBloodStock() : async [BloodStock] {
    bloodStock.values().toArray().sort(BloodStock.compareByBloodGroup);
  };

  // Request CRUD with filters
  public shared ({ caller }) func createRequest(bloodGroup : Text, units : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create requests");
    };

    let newRequest : Request = {
      id = nextRequestId;
      user = caller;
      bloodGroup;
      units;
      status = #pending;
      requestDate = Time.now();
    };

    requests.add(nextRequestId, newRequest);
    nextRequestId += 1;
  };

  public shared ({ caller }) func updateRequestStatus(requestId : Nat, newStatus : { #pending; #approved; #rejected }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update requests");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?existing) {
        let updatedRequest : Request = {
          id = existing.id;
          user = existing.user;
          bloodGroup = existing.bloodGroup;
          units = existing.units;
          status = newStatus;
          requestDate = existing.requestDate;
        };
        requests.add(requestId, updatedRequest);
      };
    };
  };

  // Users can only view their own requests
  public query ({ caller }) func getRequestsByUser(user : Principal) : async [Request] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own requests");
    };
    requests.values().toArray().filter(func(r) { r.user == user });
  };

  // Admin-only: view all requests by status
  public query ({ caller }) func getRequestsByStatus(status : { #pending; #approved; #rejected }) : async [Request] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all requests");
    };
    requests.values().toArray().filter(func(r) { r.status == status });
  };

  // Admin-only: count requests by status
  public query ({ caller }) func countRequestsByStatus(status : { #pending; #approved; #rejected }) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can count requests");
    };
    requests.values().toArray().filter(func(r) { r.status == status }).size();
  };

  // Profile management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  // Profile registration (requires user-level access)
  public shared ({ caller }) func registerProfile(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register profiles");
    };

    if (users.containsKey(caller)) {
      Runtime.trap("Profile already exists. Use update instead");
    };

    let profile : UserProfile = {
      id = caller;
      name;
      email = null;
      timeCreated = Time.now();
    };

    users.add(caller, profile);
  };
};
