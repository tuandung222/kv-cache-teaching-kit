# 06 Advanced Systems

## Objective

After the architectural semantics are correct, add systems-oriented cache strategies.

## Suggested tracks

- static preallocated cache
- offloaded cache
- quantized cache
- paged or block-based cache
- beam-search reorder support

## Track A: Static Cache

Implement:

- preallocated KV storage
- in-place updates
- explicit `max_cache_len`

Learn:

- why static shapes help compilers
- why preallocation trades memory flexibility for runtime stability

## Track B: Offloaded Cache

Implement:

- layer-wise CPU offload
- optional prefetch of the next layer

Learn:

- how to trade VRAM for transfer cost
- why offloading helps long context but may hurt latency

## Track C: Quantized Cache

Implement:

- per-group quantization for K/V
- a small residual unquantized region

Learn:

- why cache quantization is different from weight quantization
- where numerical drift appears first

## Track D: Paged Cache

Implement:

- block allocation instead of single contiguous append
- logical sequence-to-block mapping

Learn:

- why fragmentation matters
- why paged cache is primarily a serving-systems optimization

## Required artifacts

- benchmark note for each track
- failure analysis
- trade-off summary versus baseline dynamic cache

## Exit criteria

You can discuss KV Cache as a systems design space, not only as an algorithmic trick.
