package com.soujava.collabtime;

import io.opentelemetry.api.baggage.Baggage;
import io.opentelemetry.context.Context;
import io.opentelemetry.sdk.autoconfigure.AutoConfiguredOpenTelemetrySdkBuilder;
import io.opentelemetry.sdk.trace.ReadWriteSpan;
import io.opentelemetry.sdk.trace.ReadableSpan;
import io.opentelemetry.sdk.trace.SpanProcessor;
import io.quarkus.opentelemetry.runtime.AutoConfiguredOpenTelemetrySdkBuilderCustomizer;
import jakarta.inject.Singleton;

@Singleton
public class OtelConfiguration implements AutoConfiguredOpenTelemetrySdkBuilderCustomizer {
    @Override
    public void customize(AutoConfiguredOpenTelemetrySdkBuilder builder) {
        builder.addTracerProviderCustomizer(
                (tracerProviderBuilder, configProperties) -> {
                    tracerProviderBuilder.addSpanProcessor(new SpanProcessor() {
                                @Override
                                public void onStart(Context parentContext, ReadWriteSpan span) {
                                    var baggage = Baggage.current().asMap();
                                    if (baggage.containsKey("user")) {
                                        span.setAttribute("local_user",baggage.get("user").getValue());
                                    }
                                }

                                @Override
                                public boolean isStartRequired() {
                                    return true;
                                }

                                @Override
                                public void onEnd(ReadableSpan span) {
                                }

                                @Override
                                public boolean isEndRequired() {
                                    return false;
                                }
                            });
                    return tracerProviderBuilder;
                });
    }
}
