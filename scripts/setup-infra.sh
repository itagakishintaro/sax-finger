#!/bin/bash
# インフラ(Firebase / GCP / GitHub)を冪等に構築する。何度実行しても安全。
# 前提: firebase login(itagaki.shintaro@gmail.com)、gcloud auth(同アカウント)、gh auth login(itagakishintaro)
set -euo pipefail

PROJECT_ID=sax-finger
DISPLAY_NAME="Sax Finger"
ACCOUNT=itagaki.shintaro@gmail.com
SA=github-action-deploy@${PROJECT_ID}.iam.gserviceaccount.com
REPO=itagakishintaro/sax-finger
ROLES=(
  roles/firebasehosting.admin
  roles/serviceusage.apiKeysViewer
  roles/run.viewer
  roles/serviceusage.serviceUsageViewer
)

echo "== 1/5 GitHubリポジトリ"
if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "ok: $REPO"
else
  gh repo create "$REPO" --public --description "サックス運指表アプリ: 選んだ音の運指をサックスイラストで表示"
fi

echo "== 2/5 Firebaseプロジェクト"
if gcloud projects describe "$PROJECT_ID" --account "$ACCOUNT" >/dev/null 2>&1; then
  echo "ok: $PROJECT_ID"
else
  firebase projects:create "$PROJECT_ID" --display-name "$DISPLAY_NAME" --non-interactive
fi

echo "== 3/5 API有効化"
gcloud services enable firebasehosting.googleapis.com \
  --project "$PROJECT_ID" --account "$ACCOUNT"

echo "== 4/5 デプロイ用サービスアカウントとIAM"
if gcloud iam service-accounts describe "$SA" --project "$PROJECT_ID" --account "$ACCOUNT" >/dev/null 2>&1; then
  echo "ok: $SA"
else
  gcloud iam service-accounts create "${SA%%@*}" --display-name "GitHub Actions deploy" \
    --project "$PROJECT_ID" --account "$ACCOUNT"
fi
for role in "${ROLES[@]}"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" --member "serviceAccount:$SA" \
    --role "$role" --condition=None --account "$ACCOUNT" >/dev/null
  echo "granted: $role"
done

echo "== 5/5 GitHub Secret (FIREBASE_SERVICE_ACCOUNT)"
secrets=$(gh secret list -R "$REPO" || true)
if echo "$secrets" | grep -q FIREBASE_SERVICE_ACCOUNT; then
  echo "ok: secret exists(再発行する場合はsecretを削除してから再実行)"
else
  KEY=$(mktemp)
  gcloud iam service-accounts keys create "$KEY" --iam-account "$SA" \
    --project "$PROJECT_ID" --account "$ACCOUNT"
  gh secret set FIREBASE_SERVICE_ACCOUNT -R "$REPO" < "$KEY"
  rm -f "$KEY"
fi

echo "完了"
