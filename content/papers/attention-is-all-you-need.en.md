---
title: "Paper Note | Attention Is All You Need"
date: 2026-09-15
lang: en
tags:
  - deep-learning
  - transformer
  - nlp
summary: Replaces recurrence and convolution with attention alone, introducing multi-head scaled dot-product attention and the Transformer.
authors: Vaswani et al.
venue: NeurIPS 2017
translationId: attention-is-all-you-need
---

## Problem

RNNs compute step by step, so they **cannot be parallelized**, and long sequences mean long gradient paths and hard-to-learn dependencies.
Existing attention mechanisms were still attached to RNNs and did not remove the sequential bottleneck.

## Key ideas

- **Scaled dot-product attention**: `Attention(Q,K,V) = softmax(QK^T / √d_k)V`. The √d_k scaling prevents large dot products from pushing softmax into saturated regions.
- **Multi-head attention**: parallel Q/K/V projections attend to different positions and subspaces, then are concatenated.
- **Positional encoding**: the model has no notion of order; sinusoidal encodings inject position information.
- **Architecture**: 6-layer encoder–decoder stack; each layer is attention + feed-forward sub-layers with residual connections and LayerNorm.

## Why it matters

1. Training is fully parallelizable, making much better use of hardware.
2. The path between any two positions is O(1), easing long-range dependency modeling.
3. It became the foundation of BERT, GPT and later large models.

## Reflections

- Attention is essentially **similarity-weighted information retrieval**: Q is the query, K the index, V the content.
- The cost is quadratic complexity in sequence length — the starting point for later work on sparse and linear attention.
