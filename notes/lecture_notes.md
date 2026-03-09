# KV Cache for Research Scientists

## Seminar frame

- Audience: AI researchers, research scientists, PhD students
- Duration: 60 minutes
- Assumption: learners already understand self-attention, causal masking, and autoregressive decoding
- Teaching goal: learners should leave able to predict when KV Cache helps, when it hurts, and where the real serving bottleneck moves

## Learning objectives

By the end of the lecture, learners should be able to:

1. Explain exactly what KV Cache stores and why it exists in autoregressive decoding.
2. Distinguish prefill from decode at the level of workload shape, hardware pressure, and latency metrics.
3. Derive the dominant KV Cache memory term and estimate footprint for a concrete model.
4. Explain why MHA, GQA, and MQA differ not only architecturally but also operationally.
5. Reason about when inference becomes memory-bandwidth-bound rather than compute-bound.
6. Evaluate optimizations such as paged KV Cache, prefix caching, sliding windows, and cache quantization.

## Suggested pacing

- 0-5 min: framing and learning objectives
- 5-12 min: why KV Cache exists
- 12-20 min: prefill vs decode
- 20-30 min: tensor layout and memory formula
- 30-40 min: systems bottlenecks and batching
- 40-50 min: architectural variants and optimizations
- 50-57 min: misconceptions and open questions
- 57-60 min: recap and discussion

## Section 1: The problem KV Cache solves

### Core message

In autoregressive decoding, the model generates one new token at a time. Without caching, every decode step recomputes attention keys and values for all prior tokens in every layer. KV Cache avoids that recomputation by storing those keys and values once and reusing them.

### The precise statement

For a given layer `l`, previously processed tokens have already produced:

- `K_l in R^{T x H_kv x d}`
- `V_l in R^{T x H_kv x d}`

At decode step `t = T + 1`, the model computes:

- the new query for the current token
- the new key and value for the current token

Then it appends the new key and value to the cached tensors and performs attention of the new query against the cached keys and values.

### Important nuance

The query is not cached across steps because the query depends on the current token representation. Keys and values for past tokens remain valid because those past hidden states are fixed once the prefix is fixed during standard autoregressive inference.

### Teaching move

Ask:

- What exactly is redundant without cache?
- Why are K and V reusable but Q is not?

If the room answers only "because cache is faster," push them to name the repeated computation more precisely.

## Section 2: Prefill vs decode

### Core message

Prefill and decode are different workloads and should not be mentally collapsed.

### Prefill

- Input: a prompt of length `T`
- Behavior: process the full prompt in parallel under a causal mask
- Outcome: populate the KV Cache for all prompt tokens
- Typical bottleneck: matrix compute and prompt-length-dependent latency
- Related metric: time to first token (TTFT)

### Decode

- Input: one new token per step
- Behavior: append one position to the cache and attend over all prior cached positions
- Outcome: grow the output sequence while extending the cache
- Typical bottleneck: memory traffic, scheduler efficiency, cache layout, and batch interaction
- Related metric: inter-token latency (ITL)

### Common failure

Researchers sometimes infer decode behavior from prefill intuition. That is usually wrong. Prefill has more parallel work and often better arithmetic intensity. Decode has far less compute per step but poor reuse from the hardware perspective, especially at long context and multi-request serving.

### Teaching move

Ask the audience:

- If FLOPs per token fall during decode, why can throughput still remain poor?

This usually surfaces the shift from compute pressure to bandwidth and memory movement.

## Section 3: Memory footprint

### Core formula

For an approximate KV Cache memory footprint:

`memory_bytes ~= B * L * T * H_kv * d * 2 * bytes_per_element`

Where:

- `B`: batch size or number of active sequences
- `L`: number of layers
- `T`: cached sequence length
- `H_kv`: number of key-value heads
- `d`: head dimension
- `2`: one factor for keys and one for values
- `bytes_per_element`: for example 2 for FP16

### Worked example

Suppose:

- `B = 1`
- `L = 32`
- `T = 32768`
- `H_kv = 8`
- `d = 128`
- dtype is FP16

Then:

`memory ~= 1 * 32 * 32768 * 8 * 128 * 2 * 2`

`= 4,294,967,296 bytes ~= 4 GiB`

This is already substantial for a single sequence. If the same model used MHA with `H_kv = 32` instead of GQA with `H_kv = 8`, the KV footprint would be about `16 GiB`.

### Interpretation

This is why GQA and MQA matter operationally. They are not only modeling choices. They directly change serviceable context length and batch capacity.

## Section 4: Compute intuition

### Without KV Cache

At decode step `t`, each layer would recompute keys and values for all `t` prior tokens. Across the full generation, this repeated work grows badly with sequence length.

### With KV Cache

Each step only computes keys and values for the new token, then reuses cached tensors for prior positions. This reduces repeated projection work. But the attention operation still has to read the cache, so the decode step is not free and does not become `O(1)` in sequence length in any fully meaningful system sense.

### Key clarification

KV Cache does not make "attention constant cost" in practice. It removes a specific recomputation term. The system still pays for reading a growing memory structure and performing attention against it.

## Section 5: Systems view

### Why decode becomes a systems problem

At long context, decode often becomes constrained by:

- memory bandwidth to read K/V
- cache layout and locality
- allocator fragmentation
- continuous batching policy
- heterogeneous sequence lengths across requests

### Continuous batching

Serving systems mix requests at different stages of prefill and decode. That improves utilization, but it complicates cache management because each request has different active lengths and growth rates.

### Fragmentation

Naive contiguous allocation can waste memory or create costly movement when sequences grow. Paged KV designs reduce that pain by storing cache in fixed-size blocks rather than assuming perfect contiguous growth.

### Prefix caching

When many requests share a common prompt prefix, systems can reuse precomputed KV states for that prefix. This shifts the question from "do we cache within a request?" to "can we also reuse cache across requests?"

## Section 6: MHA vs GQA vs MQA

### MHA

- Each attention head has its own K and V.
- Best representational flexibility among the three in the naive view.
- Largest KV footprint.

### GQA

- Multiple query heads share one K/V head group.
- Good trade-off for modern serving systems.
- Common in many efficient LLMs because it significantly lowers KV memory without collapsing to a single K/V head.

### MQA

- All query heads share a single K/V head.
- Smallest KV footprint.
- Can improve serving efficiency further, though quality and architecture trade-offs depend on the model.

### Teaching move

Ask:

- If you had to serve 128k context on fixed VRAM, what architectural parameter would you inspect first?

The right answer usually includes `H_kv`, not only parameter count.

## Section 7: Optimization landscape

### Paged KV Cache

Reduces fragmentation and simplifies growth by chunking cache into fixed-size pages or blocks.

### Sliding-window attention

Limits how much historical context the model attends to, reducing active KV memory or effective read cost, depending on implementation.

### Prefix caching

Reuses prefill work across requests sharing the same prefix.

### Cache quantization

Stores K/V in lower precision to reduce memory footprint and bandwidth demand, at the cost of additional implementation complexity and possible quality impact.

### Compression and eviction

Try to keep only the most useful context or a compressed representation, but this introduces accuracy-risk and policy design questions.

### Speculative decoding

Does not directly replace KV Cache. It changes the decoding strategy and can alter effective throughput, but cache behavior and verification cost still matter.

## Section 8: What to measure

### Metrics

- TTFT
- ITL
- tokens/sec
- peak KV memory
- effective batch size
- memory bandwidth utilization
- prefix-cache hit rate
- fragmentation or allocator waste

### Experimental caution

Never report "tokens/sec improved" without clarifying:

- prompt length distribution
- output length distribution
- batch policy
- architecture variant
- dtype and quantization
- hardware

Otherwise the result is not interpretable.

## Section 9: Five common misconceptions

1. KV Cache makes decode constant-time.
   Correction: it removes recomputation of old K/V projections, but cache reads still scale with active context.

2. KV Cache is mostly a compute story.
   Correction: in real serving, it is often more about memory capacity, bandwidth, and scheduler interaction.

3. Prefill and decode are basically the same.
   Correction: they have different shapes, metrics, and hardware bottlenecks.

4. GQA and MQA are only architecture details.
   Correction: they are also first-order serving decisions because they change `H_kv`.

5. Long context is mainly a modeling issue.
   Correction: it is also a cache-management and systems-efficiency issue.

## Section 10: Open research questions

- How far can KV quantization go before the quality-serving trade-off becomes unfavorable?
- Which cache compression or eviction strategies preserve the most useful information?
- How should schedulers co-optimize batching and cache locality?
- Can model architectures be designed jointly with serving constraints rather than patched later?
- Which metrics best predict user-perceived quality of service under long-context workloads?

## Closing recap

If the audience remembers only one sentence, make it this:

KV Cache is not merely a speed trick. It is the mechanism that transforms autoregressive inference from a recomputation problem into a memory-management problem.

## Discussion prompts

- Under what workload would prefix caching matter more than GQA?
- When does reducing KV precision help more than changing the attention architecture?
- What benchmark would you design to separate compute bottlenecks from memory bottlenecks?
- What happens to your mental model when context is 4k versus 128k?
