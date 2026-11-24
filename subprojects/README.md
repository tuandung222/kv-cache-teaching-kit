# KV Cache Subprojects

This folder turns the teaching repo into an implementation roadmap.

The goal is not to reproduce Hugging Face immediately. The goal is to build KV Cache from first principles across increasingly difficult architecture families until the abstractions become obvious.

## Recommended order

1. `00-common-runtime`
2. `01-gpt-decoder-only-absolute-pos`
3. `02-llama-gqa-rope`
4. `03-bart-mbart-encoder-decoder`
5. `04-t5-relative-position-bias`
6. `05-mistral-sliding-window`
7. `06-advanced-systems`

## Design principle

Each subproject should stay small enough to reason about end-to-end:

- one model family
- one KV Cache shape story
- one position-handling story
- one decoding loop
- one benchmark harness

## Global learning outcomes

After finishing the sequence, you should be able to:

- implement a minimal `Cache` abstraction from scratch
- explain why decoder-only and encoder-decoder caches differ structurally
- explain how positional encoding changes the cache contract
- explain why GQA changes cache storage but not the final attention head count
- explain why sliding-window and hybrid attention change cache growth rules
- reason about when cache engineering becomes a systems problem

## Shared contract for all subprojects

Every subproject should implement:

- a `forward_prefill(...)`
- a `forward_decode_step(...)`
- a cache object with explicit tensor shapes
- a numerical parity check between no-cache and cache mode
- a microbenchmark for prefill and decode
- a short note documenting the architecture-specific cache invariants

## Suggested repository shape inside each subproject

```text
subprojects/<name>/
├── README.md
├── NOTES.md
├── src/
│   ├── model.py
│   ├── cache.py
│   ├── attention.py
│   ├── decode.py
│   └── positions.py
├── tests/
│   ├── test_cache_equivalence.py
│   ├── test_shapes.py
│   └── test_decode_loop.py
└── experiments/
    └── benchmark.py
```

## Cross-subproject milestones

### Milestone A: API stability

Define one clean cache interface before adding architecture quirks.

Recommended minimal interface:

```python
class Cache:
    def get_seq_length(self, layer_idx: int) -> int: ...
    def update(self, key, value, layer_idx: int, cache_kwargs: dict | None = None): ...
    def reorder(self, beam_idx): ...
    def reset(self): ...
```

### Milestone B: correctness

For every architecture:

- logits with cache and without cache should match numerically
- generation with iterative decode should match generation from full recomputation
- cache tensor shapes should be asserted explicitly

### Milestone C: measurement

Measure at least:

- prefill latency
- decode latency per token
- peak cache bytes
- sequence-length scaling

### Milestone D: architecture-specific reasoning

Document:

- what is cached
- what is not cached
- why cache update is valid
- how position handling depends on cache length

## Scope boundaries

Do not start with:

- FlashAttention kernels
- paged attention kernels
- distributed inference
- speculative decoding

Add those only after the architecture-level semantics are correct.
