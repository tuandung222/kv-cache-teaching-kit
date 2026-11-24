# 05 Mistral-Style Sliding Window Cache

## Why this subproject exists

This is where cache growth rules stop being append-forever.

## Architecture target

- decoder-only transformer
- RoPE
- GQA
- sliding-window attention

## Core idea

The logical sequence keeps growing, but the active cache retained per layer is bounded by the sliding window.

## What to implement

- a sliding-window cache layer
- mask construction for local causal attention
- decode logic that evicts or overwrites obsolete positions

## Implementation tasks

1. Define a maximum active window `W`.
2. Keep only the last `W` cached positions per layer.
3. Ensure the attention mask matches the retained cache span.
4. Preserve correct RoPE positions even when storage window is bounded.
5. Benchmark memory growth versus full attention.

## Required experiments

- memory stays bounded with sequence length growth
- logits match a reference implementation restricted to the same attention window
- verify which position is the oldest retained token

## Common mistakes

- keeping a bounded cache but still building a full causal mask
- confusing physical cache index with logical token position
- rotating positions relative to local buffer index instead of global token position

## Exit criteria

You can explain the difference between logical context length and physically retained KV states.
