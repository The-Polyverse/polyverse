import { createMachine } from "xstate";

/**
 * Message Domain Entity
 *
 * Messages are the core of the application. They are the main entity that is
 * carries the core business logic of communication between agents through
 * conversations.
 *
 * @xstate-config N4IgpgJg5mDOIC5QFs6wIYwHQEsB2OALjugDY4BekAxAMYBOY6hYA2gAwC6ioADgPawiOfnh4gAHogCMADgCsWefIAsANlnsVAZgBM22erUAaEAE9E86eywqAnA4Ds2+Y7UrrugL5fTqWBjY+MJklDS0pKJsXOICQsSi4lIIcorK6po6+oZqJuaIKvJ2WA4OstJ2jp52rj5+aJhguATEoVQQ1IyE9DhgAG7R3EggccKJw8mpSqoaWnoGRqYWCNqOuliyjvZqRVba0o7OdSD+gU3BreTtnXCE-IwcQ3yCY2ITMgrTGXPZi-kI5SU7GB0lUKkM8jUx1OjSwDCYLA6fVCEGYg1iLwSb1AyR02hKukq7DcukcWnUS0s7Hxunsdg0hi29m00Ia2C6PX6NAArrxUSxHhj4iJsZICtp8XZCWSSWSVBT-gZ1nSakZ2JC1FtWQFYRzegMOhAwKQwAKYsNRlikuLJdLiWpSeS8stdGppCVSg6VM5gXYVNqzlg9VyOuh6LQABY4AaCi2YkXWhB4glE2VOykIXTsda00q6WS5VXEgOw5Hkfk0XhgehCWCEWPPYXjHEyOQ2KqbB3E6TgtwZpW2UozNTq3Ja3wnNlNXkVpEotENkbx5tigH6D26HsKFTAgvSfuyZVDtUa8f1HXYMOR6M0Rh1+7ouNN0XJOW2EdSke
 */
const messageMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFs6wIYwHQEsB2OALjugDY4BekAxAMYBOY6hYA2gAwC6ioADgPawiOfnh4gAHogBMAFmlYArADZ2AdjkBmaQE45ADnUAaEAE9EARn0LFizWsXTV+ncs3qAvh5OpYGbPjCZJQ0jIT0OGAAbmxc4gJCxKLiUggWyopKytKK7KoqOpqaKibmCPKyWHnKNe4Waq5ePmiYYLgExMFUENQc3EggCcLJA6nS+pUORWp5heyyFrLKpYj6Fkrsm+zS0uo79spNIL7+bQxMLD1RwRDMsf18gsNio4hqFuuyeU7bakuyigsKwQmmU+iw6RqGUW7E0AKOJ1aWDCEWiNFopFE93iTySL1AqVkcKwTkMOmsFh07EUC2Bmn0yiwekBcPmdh0CwRLWwKMiMR6AFdeLcWH0cYkRPjJIhZF8qkt9C4aTpydIgWZEKoFAtaq5QVZ0ly-EjeWiehAwKQwKK4gMhniUjL7FV9IodLkrAyZuqyktNEz3NINNlFPoGoojadkdbUfzqOh6LQABY4GJiu24yWO8py+ZgpWyFUU4EGEm5TbyOxuTQ6SNI67kEU0XhgehCWCEdOPCUjAmWSn+lQ5FTpelWEtyyHKDQTZTuuQR7zHbltBs4Js9FttnAd1gWB6DTO96VpAdZYfKUdrfTA2RrLBQmoWcYzBZwuvYIUb6hrptdw89lKqT1OwOgkvI0igjofwAm6dKXlgOrQpSqh6GoH5tAmyapqEcCEPwjD-vaWavAg7yfN8Wp-MoAI+jIshqIhkIzHosKbHYGFYFhKZxlu7adra3bPNm5GIZRvz-ICwIfGBSEzHOiy2HonGMB2BE0L+dxEUeQGIByjFOLYbjZNBhiaBOjFyaBuzuNSmica29DqYKwpaYJAHCaRFiKA0JIZDUagMhMazLBq5T3o+l4vvMFj2UceD8Ba8ADIiMDip5fYIAAtDUfmUq4NJ3tBJRhVl4I5FsmyuqB1iFJxgSdOQ3TpQ6pFZVYeUqhksouA4JVlL5FWbA02jGRYnHnHcEAtSRmU+YySGXvY6gTHRIJgg+j6Al8cKLs0xo8jGfKQDNx5jO6VRqKChjzKxmhrX6AbbIqhbTvooJ7cuB2rjcU2nbpaR5IxYJ-DM7hRfI8GfFO8lzq4YacXxO6XP92aLLsWBg95ao4zkaglvdmOFiq8lFdZnFfn9GaAWjLEPmGgIWHkz7sC4wJuv6ujpKGNbycUnEWlaKPUxlJ4qP6DQgyy05qBkt7ZPTz3bNjd7oUuqWYYmPEnSLrVzYFVSVTJOTyKFZRyOs5abJehjjD5av7VGqn4Yw0267NJ7ves1hrLCSxXRo5lhXIjE6Mx1lsXZDn0E5ruo15soS1YfzPsUmzure1gQo+z5hjF75eB4QA */
  types: {
    context: {} as {
      id: string;
      content: string;
    },
    input: {} as {
      id: string;
      content: string;
    },
    events: {} as
      | { type: "create" }
      | { type: "clone" }
      | { type: "retrieve" }
      | { type: "validate" }
      | { type: "persist" }
      | { type: "update" }
      | { type: "delete" }
      | { type: "archive" }
      | { type: "restore" }
      | { type: "error" },
    states: {} as {
      initialized: object;
      created: object;
      retrieved: object;
      validated: object;
      persisted: object;
      updated: object;
      deleted: object;
      archived: object;
      restored: object;
      errored: object;
    },
  },
  id: "message",
  context: ({ input }) => ({ ...input }),
  initial: "initialized",
  states: {
    initialized: {
      on: {
        create: "created",
        retrieve: "retrieved",
      },
      always: {
        target: "archived",
        guard: "isArchived",
        // @ts-expect-error the visual editor doesn't support the `guard` property yet
        cond: "isArchived",
      },
    },
    created: {
      on: {
        validate: "validated",
      },
    },
    retrieved: {
      on: {
        clone: "created",
        update: "updated",
        delete: "deleted",
        archive: "archived",
      },
    },
    validated: {
      on: {
        persist: [
          {
            target: "persisted",
            guard: "isValid",
            // @ts-expect-error the visual editor doesn't support the `guard` property yet
            cond: "isValid",
          },
          {
            target: "errored",
          },
        ],
      },
    },
    persisted: {
      type: "final",
    },
    updated: {
      on: {
        validate: "validated",
      },
    },
    deleted: {
      type: "final",
    },
    archived: {
      on: {
        restore: "restored",
        persist: "persisted",
      },
    },
    restored: {
      on: {
        validate: "validated",
      },
    },
    errored: {
      on: {
        update: "updated",
      },
    },
  },
});

export default messageMachine;
