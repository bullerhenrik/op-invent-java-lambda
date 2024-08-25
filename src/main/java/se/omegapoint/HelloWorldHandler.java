package se.omegapoint;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HelloWorldHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final HelloService helloService;
    private final WorldService worldService;

    public HelloWorldHandler() {
        this.helloService = new HelloService();
        this.worldService = new WorldService();

        var hello = helloService.getHello();
        var world = worldService.getWorld();

        log.debug("Completed initialization: {}, {}!", hello, world);
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent apiGatewayProxyRequestEvent, Context context) {
        var hello = helloService.getHello();
        var world = worldService.getWorld();
        var message = "%s %s!".formatted(hello, world);

        log.debug("Request handled: {}", message);
        return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(message);
    }
}
