This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 以下を意識して回答してください
・開発者本人が、ReactとNode.jsの仕様を理解していない。
また、Webアプリを行ったことがないので、解説をして理解度を確認し、次の開発へ移ること。解説は長く無くてOK。

## Develop
・このプロジェクトはDDDを採用しており、オニオンアーキテクチャに従っている。
・インフラ層への依存は禁止（依存性逆転）
・各層へ該当するソースを記載すること。

## やってはいけないこと
・指示する場合以外は、プルリクエスト作成、別ブランチへのコミット、マージは行ってはいけない。