import { Request } from "express"

export type TypedRequest<TParams = {}, TQuery = {}, TBody = {}> = Request<TParams, any, TBody, TQuery>

/**
 * ------------
 * EXPLANATION
 * ------------
 * TypedRequest is a strongly typed wrapper around Express's Request type.
 *
 * It allows us to define the shapes of:
 * - req.params (TParams)
 * - req.query  (TQuery)
 * - req.body   (TBody)
 *
 * Step-by-step: how TypeScript fills the boxes
 *
 * Step 1: You write this:
 * TypedRequest<{ id: string }, { page: string }, { name: string }>
 *
 * TypeScript performs substitution (like algebra):
 * TParams = { id: string }
 * TQuery  = { page: string }
 * TBody   = { name: string }
 *
 * Step 2: Those types are plugged into Express's Request:
 * Request<
 *   { id: string },   // req.params
 *   any,              // response body (ignored here)
 *   { name: string }, // req.body
 *   { page: string }  // req.query
 * >
 *
 * The resulting request object looks like:
 * params → { id: string }
 * query  → { page: string }
 * body   → { name: string }
 *
 * Inside a route handler 🧠
 * req.params.id   // string ✅
 * req.query.page  // string ✅
 * req.body.name   // string ✅
 *
 * If you make a mistake:
 * req.params.userId
 * ❌ TypeScript error:
 * Property 'userId' does not exist.
 * Because params only contains { id: string }.
 *
 * Result:
 * You get autocomplete and type safety on req.params, req.query, and req.body.
 * Example:
 * req.body.foobar // ❌ TS error: Property 'foobar' does not exist
 */
