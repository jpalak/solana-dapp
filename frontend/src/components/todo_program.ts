/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/todo_program.json`.
 */
export type TodoProgram = {
  "address": "HaH9whuijUtKQK7jr2Su5GNqRRPRDLUXQxEKoQ94VhfU",
  "metadata": {
    "name": "todoProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addingTask",
      "discriminator": [
        220,
        23,
        140,
        58,
        16,
        79,
        103,
        48
      ],
      "accounts": [
        {
          "name": "todoAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  100,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "todoAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeAccount",
      "discriminator": [
        74,
        115,
        99,
        93,
        197,
        69,
        103,
        7
      ],
      "accounts": [
        {
          "name": "todoAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  100,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "removingTask",
      "discriminator": [
        167,
        234,
        194,
        109,
        188,
        8,
        32,
        56
      ],
      "accounts": [
        {
          "name": "todoAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  100,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "todoAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        }
      ]
    },
    {
      "name": "togglingTask",
      "discriminator": [
        185,
        80,
        235,
        94,
        75,
        233,
        72,
        81
      ],
      "accounts": [
        {
          "name": "todoAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  100,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "todoAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "todoAccount",
      "discriminator": [
        31,
        86,
        84,
        40,
        187,
        31,
        251,
        132
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "contentTooLong",
      "msg": "The content must be 280 characters or less"
    },
    {
      "code": 6001,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow when updating task count"
    },
    {
      "code": 6002,
      "name": "invalidAuthority",
      "msg": "Invalid authority provided for this operation"
    },
    {
      "code": 6003,
      "name": "invalidTaskIndex",
      "msg": "Task index is invalid"
    },
    {
      "code": 6004,
      "name": "taskNotFound",
      "msg": "Task not found"
    },
    {
      "code": 6005,
      "name": "invalidTaskState",
      "msg": "Invalid task state transition"
    },
    {
      "code": 6006,
      "name": "invalidContent",
      "msg": "Invalid task content"
    },
    {
      "code": 6007,
      "name": "taskAlreadyCompleted",
      "msg": "Task already completed"
    }
  ],
  "types": [
    {
      "name": "task",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "completed",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "todoAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "tasks",
            "type": {
              "vec": {
                "defined": {
                  "name": "task"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
